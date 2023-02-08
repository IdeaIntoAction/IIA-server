/** @typedef {import('./types').Bus} IBus */
/** @typedef {import('./types').Command} ICommand */
/** @typedef {import('./types').PubSub} IPubSub */
/** @typedef {import('./types').CallData} CallData */
/** @typedef {import('./types').CallResponse} CallResponse */
/** @typedef {import('./types').init} init */
import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';

/** @implements {IBus} */
class Bus {
  #ee;
  #localServices;
  #redis;
  #calls;

  /** @type string */
  #serverId;
  /** @type boolean */
  #terminating = false;

  /** @type init */
  constructor({ redis }, { serverId }) {
    this.#serverId = serverId;
    this.#redis = redis;
    this.#ee = new EventEmitter();
    this.#localServices = new Map();
    this.#calls = new Map();
  }

  /** @type IBus['listen'] */
  async listen() {
    const subKey = `response:${this.#serverId}:*`;
    this.#redis.pSubscribe(subKey, this.#handleResponse);

    const services = this.#localServices.keys();
    for (const serviceName of services) {
      while (!this.#terminating) await this.#listenRemoteCalls(serviceName);
    }
  }

  /** @type IBus['teardown'] */
  async teardown() {
    this.#terminating = true;
    await setTimeout(10000);
    await this.#redis.unsubscribe();
  }

  /** @type ICommand['call'] */
  call(commandParams, payload) {
    return this.#localServices.has(commandParams.service)
      ? this.#localCall(commandParams, payload)
      : this.#remoteCall(commandParams, payload);
  }

  /** @type ICommand['registerService'] */
  registerService(name, service) {
    this.#localServices.set(name, service);
  }

  /** @type IPubSub['subscribe'] */
  subscribe(event, handler) {
    this.#ee.on(event, handler);
    return true;
  }

  /** @type IPubSub['publish'] */
  publish(event, payload) {
    return this.#ee.emit(event, payload);
  }

  /** @type ICommand['call'] */
  async #localCall({ service: serviceName, method }, payload) {
    const service = this.#localServices.get(serviceName);
    const handler = service[method];
    if (!handler)
      return [{ expected: false, message: 'Method not found' }, null];
    const result = await handler(payload);
    return result;
  }

  /** @type ICommand['call'] */
  async #remoteCall({ service: serviceName, method }, payload) {
    const callId = randomUUID();
    const streamKey = `${serviceName}:${method}:request`;
    /** @type CallData */
    const data = {
      serverId: this.#serverId,
      callId,
      payload: JSON.stringify(payload),
    };
    await this.#redis.xAdd(streamKey, '*', data, {
      TRIM: { strategy: 'MAXLEN', strategyModifier: '~', threshold: 10000 },
    });
    return new Promise((resolve, reject) => {
      this.#calls.set(callId, { resolve, reject });
    });
  }

  /** @type {(message: string, channel: string) => void} */
  #handleResponse(message, channel) {
    const callId = channel.split(':').at(-1);
    const promise = this.#calls.get(callId);
    if (!promise) return; // need to handle properly
    /** @type CallResponse */
    const response = JSON.parse(message);
    promise.resolve(response);
  }

  /** @type {(streamName: string, data: CallData) => Promise<void>} */
  async #handleRemoteCall(
    streamName,
    { serverId, callId, payload: strPayload },
  ) {
    const [service, method] = streamName.split(':');
    const payload = JSON.parse(strPayload);

    const result = await this.#localCall({ service, method }, payload);

    const message = JSON.stringify(result);
    this.#redis.publish(`response:${serverId}:${callId}`, message);
  }

  /** @type {(serviceName: string) => Promise<void>} */
  async #listenRemoteCalls(serviceName) {
    const service = this.#localServices.get(serviceName);
    const streams = [];
    for (const methodName of Object.keys(service)) {
      const key = `${serviceName}:${methodName}:request`;
      streams.push({ key, id: '>' });
    }
    const events = await this.#redis.xReadGroup(
      serviceName,
      this.#serverId,
      streams,
      { COUNT: 1, BLOCK: 10000, NOACK: true },
    );
    if (!events?.length) return;
    const { name, messages } = events[0];
    const { message } = messages[0];
    const payload = /** @type CallData */ (message);
    this.#handleRemoteCall(name, payload);
  }
}

/** @type init */
export const init = (deps, options) => new Bus(deps, options);
