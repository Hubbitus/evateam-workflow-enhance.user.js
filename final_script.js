// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the built-in process view in EvaTeam with an advanced visualization using SvelteFlow
// @author       Pavel Alexeev <Pahan@Hubbitus.info>
// @match        https://eva.gid.team/project/Task/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('HuEvaFlowEnhancer: Script started loading.');

var HuEvaFlowEnhancer = (function (exports) {
	'use strict';

	// generated during release, do not modify

	const PUBLIC_VERSION = '5';

	if (typeof window !== 'undefined') {
		// @ts-expect-error
		((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
	}

	const EACH_ITEM_REACTIVE = 1;
	const EACH_INDEX_REACTIVE = 1 << 1;
	/** See EachBlock interface metadata.is_controlled for an explanation what this is */
	const EACH_IS_CONTROLLED = 1 << 2;
	const EACH_IS_ANIMATED = 1 << 3;
	const EACH_ITEM_IMMUTABLE = 1 << 4;

	const PROPS_IS_IMMUTABLE = 1;
	const PROPS_IS_RUNES = 1 << 1;
	const PROPS_IS_UPDATED = 1 << 2;
	const PROPS_IS_BINDABLE = 1 << 3;
	const PROPS_IS_LAZY_INITIAL = 1 << 4;

	const TEMPLATE_FRAGMENT = 1;
	const TEMPLATE_USE_IMPORT_NODE = 1 << 1;

	const UNINITIALIZED = Symbol();

	const NAMESPACE_HTML = 'http://www.w3.org/1999/xhtml';

	const ATTACHMENT_KEY = '@attach';

	var DEV = false;

	// Store the references to globals in case someone tries to monkey patch these, causing the below
	// to de-opt (this occurs often when using popular extensions).
	var is_array = Array.isArray;
	var index_of = Array.prototype.indexOf;
	var includes = Array.prototype.includes;
	var array_from = Array.from;
	var define_property = Object.defineProperty;
	var get_descriptor = Object.getOwnPropertyDescriptor;
	var get_descriptors = Object.getOwnPropertyDescriptors;
	var object_prototype = Object.prototype;
	var array_prototype = Array.prototype;
	var get_prototype_of = Object.getPrototypeOf;

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	const noop$1 = () => {};

	/** @param {Function} fn */
	function run(fn) {
		return fn();
	}

	/** @param {Array<() => void>} arr */
	function run_all(arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i]();
		}
	}

	/**
	 * TODO replace with Promise.withResolvers once supported widely enough
	 * @template [T=void]
	 */
	function deferred() {
		/** @type {(value: T) => void} */
		var resolve;

		/** @type {(reason: any) => void} */
		var reject;

		/** @type {Promise<T>} */
		var promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});

		// @ts-expect-error
		return { promise, resolve, reject };
	}

	/**
	 * @template V
	 * @param {V} value
	 * @param {V | (() => V)} fallback
	 * @param {boolean} [lazy]
	 * @returns {V}
	 */
	function fallback(value, fallback, lazy = false) {
		return value === undefined
			? lazy
				? /** @type {() => V} */ (fallback)()
				: /** @type {V} */ (fallback)
			: value;
	}

	/**
	 * When encountering a situation like `let [a, b, c] = $derived(blah())`,
	 * we need to stash an intermediate value that `a`, `b`, and `c` derive
	 * from, in case it's an iterable
	 * @template T
	 * @param {ArrayLike<T> | Iterable<T>} value
	 * @param {number} [n]
	 * @returns {Array<T>}
	 */
	function to_array(value, n) {
		// return arrays unchanged
		if (Array.isArray(value)) {
			return value;
		}

		// if value is not iterable, or `n` is unspecified (indicates a rest
		// element, which means we're not concerned about unbounded iterables)
		// convert to an array with `Array.from`
		if (n === undefined || !(Symbol.iterator in value)) {
			return Array.from(value);
		}

		// otherwise, populate an array with `n` values

		/** @type {T[]} */
		const array = [];

		for (const element of value) {
			array.push(element);
			if (array.length === n) break;
		}

		return array;
	}

	// General flags
	const DERIVED = 1 << 1;
	const EFFECT = 1 << 2;
	const RENDER_EFFECT = 1 << 3;
	/**
	 * An effect that does not destroy its child effects when it reruns.
	 * Runs as part of render effects, i.e. not eagerly as part of tree traversal or effect flushing.
	 */
	const MANAGED_EFFECT = 1 << 24;
	/**
	 * An effect that does not destroy its child effects when it reruns (like MANAGED_EFFECT).
	 * Runs eagerly as part of tree traversal or effect flushing.
	 */
	const BLOCK_EFFECT = 1 << 4;
	const BRANCH_EFFECT = 1 << 5;
	const ROOT_EFFECT = 1 << 6;
	const BOUNDARY_EFFECT = 1 << 7;
	/**
	 * Indicates that a reaction is connected to an effect root — either it is an effect,
	 * or it is a derived that is depended on by at least one effect. If a derived has
	 * no dependents, we can disconnect it from the graph, allowing it to either be
	 * GC'd or reconnected later if an effect comes to depend on it again
	 */
	const CONNECTED = 1 << 9;
	const CLEAN = 1 << 10;
	const DIRTY = 1 << 11;
	const MAYBE_DIRTY = 1 << 12;
	const INERT = 1 << 13;
	const DESTROYED = 1 << 14;
	/** Set once a reaction has run for the first time */
	const REACTION_RAN = 1 << 15;

	// Flags exclusive to effects
	/**
	 * 'Transparent' effects do not create a transition boundary.
	 * This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
	 */
	const EFFECT_TRANSPARENT = 1 << 16;
	const EAGER_EFFECT = 1 << 17;
	const HEAD_EFFECT = 1 << 18;
	const EFFECT_PRESERVED = 1 << 19;
	const USER_EFFECT = 1 << 20;
	const EFFECT_OFFSCREEN = 1 << 25;

	// Flags exclusive to deriveds
	/**
	 * Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
	 * Will be lifted during execution of the derived and during checking its dirty state (both are necessary
	 * because a derived might be checked but not executed).
	 */
	const WAS_MARKED = 1 << 16;

	// Flags used for async
	const REACTION_IS_UPDATING = 1 << 21;
	const ASYNC = 1 << 22;

	const ERROR_VALUE = 1 << 23;

	const STATE_SYMBOL = Symbol('$state');
	const LEGACY_PROPS = Symbol('legacy props');
	const LOADING_ATTR_SYMBOL = Symbol('');

	/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
	const STALE_REACTION = new (class StaleReactionError extends Error {
		name = 'StaleReactionError';
		message = 'The reaction that called `getAbortSignal()` was re-run or destroyed';
	})();

	const IS_XHTML = /* @__PURE__ */ globalThis.document?.contentType.includes('xml') ?? false;

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * `%name%(...)` can only be used during component initialisation
	 * @param {string} name
	 * @returns {never}
	 */
	function lifecycle_outside_component(name) {
		{
			throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
		}
	}

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * Cannot create a `$derived(...)` with an `await` expression outside of an effect tree
	 * @returns {never}
	 */
	function async_derived_orphan() {
		{
			throw new Error(`https://svelte.dev/e/async_derived_orphan`);
		}
	}

	/**
	 * Keyed each block has duplicate key `%value%` at indexes %a% and %b%
	 * @param {string} a
	 * @param {string} b
	 * @param {string | undefined | null} [value]
	 * @returns {never}
	 */
	function each_key_duplicate(a, b, value) {
		{
			throw new Error(`https://svelte.dev/e/each_key_duplicate`);
		}
	}

	/**
	 * `%rune%` cannot be used inside an effect cleanup function
	 * @param {string} rune
	 * @returns {never}
	 */
	function effect_in_teardown(rune) {
		{
			throw new Error(`https://svelte.dev/e/effect_in_teardown`);
		}
	}

	/**
	 * Effect cannot be created inside a `$derived` value that was not itself created inside an effect
	 * @returns {never}
	 */
	function effect_in_unowned_derived() {
		{
			throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
		}
	}

	/**
	 * `%rune%` can only be used inside an effect (e.g. during component initialisation)
	 * @param {string} rune
	 * @returns {never}
	 */
	function effect_orphan(rune) {
		{
			throw new Error(`https://svelte.dev/e/effect_orphan`);
		}
	}

	/**
	 * Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
	 * @returns {never}
	 */
	function effect_update_depth_exceeded() {
		{
			throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
		}
	}

	/**
	 * Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
	 * @param {string} key
	 * @returns {never}
	 */
	function props_invalid_value(key) {
		{
			throw new Error(`https://svelte.dev/e/props_invalid_value`);
		}
	}

	/**
	 * Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
	 * @returns {never}
	 */
	function state_descriptors_fixed() {
		{
			throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
		}
	}

	/**
	 * Cannot set prototype of `$state` object
	 * @returns {never}
	 */
	function state_prototype_fixed() {
		{
			throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
		}
	}

	/**
	 * Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
	 * @returns {never}
	 */
	function state_unsafe_mutation() {
		{
			throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
		}
	}

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * The `value` property of a `<select multiple>` element should be an array, but it received a non-array value. The selection will be kept as is.
	 */
	function select_multiple_invalid_value() {
		{
			console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
		}
	}

	/** @import { Equals } from '#client' */

	/** @type {Equals} */
	function equals(value) {
		return value === this.v;
	}

	/**
	 * @param {unknown} a
	 * @param {unknown} b
	 * @returns {boolean}
	 */
	function safe_not_equal(a, b) {
		return a != a
			? b == b
			: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
	}

	/** @type {Equals} */
	function safe_equals(value) {
		return !safe_not_equal(value, this.v);
	}

	/** True if experimental.async=true */
	/** True if we're not certain that we only have Svelte 5 code in the compilation */
	let legacy_mode_flag = false;
	/** True if $inspect.trace is used */
	let tracing_mode_flag = false;

	function enable_legacy_mode_flag() {
		legacy_mode_flag = true;
	}

	/** @import { Snapshot } from './types' */

	/**
	 * In dev, we keep track of which properties could not be cloned. In prod
	 * we don't bother, but we keep a dummy array around so that the
	 * signature stays the same
	 * @type {string[]}
	 */
	const empty$1 = [];

	/**
	 * @template T
	 * @param {T} value
	 * @param {boolean} [skip_warning]
	 * @param {boolean} [no_tojson]
	 * @returns {Snapshot<T>}
	 */
	function snapshot(value, skip_warning = false, no_tojson = false) {

		return clone(value, new Map(), '', empty$1, null, no_tojson);
	}

	/**
	 * @template T
	 * @param {T} value
	 * @param {Map<T, Snapshot<T>>} cloned
	 * @param {string} path
	 * @param {string[]} paths
	 * @param {null | T} [original] The original value, if `value` was produced from a `toJSON` call
	 * @param {boolean} [no_tojson]
	 * @returns {Snapshot<T>}
	 */
	function clone(value, cloned, path, paths, original = null, no_tojson = false) {
		if (typeof value === 'object' && value !== null) {
			var unwrapped = cloned.get(value);
			if (unwrapped !== undefined) return unwrapped;

			if (value instanceof Map) return /** @type {Snapshot<T>} */ (new Map(value));
			if (value instanceof Set) return /** @type {Snapshot<T>} */ (new Set(value));

			if (is_array(value)) {
				var copy = /** @type {Snapshot<any>} */ (Array(value.length));
				cloned.set(value, copy);

				if (original !== null) {
					cloned.set(original, copy);
				}

				for (var i = 0; i < value.length; i += 1) {
					var element = value[i];
					if (i in value) {
						copy[i] = clone(element, cloned, path, paths, null, no_tojson);
					}
				}

				return copy;
			}

			if (get_prototype_of(value) === object_prototype) {
				/** @type {Snapshot<any>} */
				copy = {};
				cloned.set(value, copy);

				if (original !== null) {
					cloned.set(original, copy);
				}

				for (var key in value) {
					copy[key] = clone(
						// @ts-expect-error
						value[key],
						cloned,
						path,
						paths,
						null,
						no_tojson
					);
				}

				return copy;
			}

			if (value instanceof Date) {
				return /** @type {Snapshot<T>} */ (structuredClone(value));
			}

			if (typeof (/** @type {T & { toJSON?: any } } */ (value).toJSON) === 'function' && !no_tojson) {
				return clone(
					/** @type {T & { toJSON(): any } } */ (value).toJSON(),
					cloned,
					path,
					paths,
					// Associate the instance with the toJSON clone
					value
				);
			}
		}

		if (value instanceof EventTarget) {
			// can't be cloned
			return /** @type {Snapshot<T>} */ (value);
		}

		try {
			return /** @type {Snapshot<T>} */ (structuredClone(value));
		} catch (e) {

			return /** @type {Snapshot<T>} */ (value);
		}
	}

	/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */

	/** @type {ComponentContext | null} */
	let component_context = null;

	/** @param {ComponentContext | null} context */
	function set_component_context(context) {
		component_context = context;
	}

	/**
	 * Retrieves the context that belongs to the closest parent component with the specified `key`.
	 * Must be called during component initialisation.
	 *
	 * [`createContext`](https://svelte.dev/docs/svelte/svelte#createContext) is a type-safe alternative.
	 *
	 * @template T
	 * @param {any} key
	 * @returns {T}
	 */
	function getContext(key) {
		const context_map = get_or_init_context_map();
		const result = /** @type {T} */ (context_map.get(key));
		return result;
	}

	/**
	 * Associates an arbitrary `context` object with the current component and the specified `key`
	 * and returns that object. The context is then available to children of the component
	 * (including slotted content) with `getContext`.
	 *
	 * Like lifecycle functions, this must be called during component initialisation.
	 *
	 * [`createContext`](https://svelte.dev/docs/svelte/svelte#createContext) is a type-safe alternative.
	 *
	 * @template T
	 * @param {any} key
	 * @param {T} context
	 * @returns {T}
	 */
	function setContext(key, context) {
		const context_map = get_or_init_context_map();

		context_map.set(key, context);
		return context;
	}

	/**
	 * Checks whether a given `key` has been set in the context of a parent component.
	 * Must be called during component initialisation.
	 *
	 * @param {any} key
	 * @returns {boolean}
	 */
	function hasContext(key) {
		const context_map = get_or_init_context_map();
		return context_map.has(key);
	}

	/**
	 * @param {Record<string, unknown>} props
	 * @param {any} runes
	 * @param {Function} [fn]
	 * @returns {void}
	 */
	function push(props, runes = false, fn) {
		component_context = {
			p: component_context,
			i: false,
			c: null,
			e: null,
			s: props,
			x: null,
			l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
		};
	}

	/**
	 * @template {Record<string, any>} T
	 * @param {T} [component]
	 * @returns {T}
	 */
	function pop(component) {
		var context = /** @type {ComponentContext} */ (component_context);
		var effects = context.e;

		if (effects !== null) {
			context.e = null;

			for (var fn of effects) {
				create_user_effect(fn);
			}
		}

		context.i = true;

		component_context = context.p;

		return /** @type {T} */ ({});
	}

	/** @returns {boolean} */
	function is_runes() {
		return !legacy_mode_flag || (component_context !== null && component_context.l === null);
	}

	/**
	 * @param {string} name
	 * @returns {Map<unknown, unknown>}
	 */
	function get_or_init_context_map(name) {
		if (component_context === null) {
			lifecycle_outside_component();
		}

		return (component_context.c ??= new Map(get_parent_context(component_context) || undefined));
	}

	/**
	 * @param {ComponentContext} component_context
	 * @returns {Map<unknown, unknown> | null}
	 */
	function get_parent_context(component_context) {
		let parent = component_context.p;
		while (parent !== null) {
			const context_map = parent.c;
			if (context_map !== null) {
				return context_map;
			}
			parent = parent.p;
		}
		return null;
	}

	/** @type {Array<() => void>} */
	let micro_tasks = [];

	function run_micro_tasks() {
		var tasks = micro_tasks;
		micro_tasks = [];
		run_all(tasks);
	}

	/**
	 * @param {() => void} fn
	 */
	function queue_micro_task(fn) {
		if (micro_tasks.length === 0 && true) {
			var tasks = micro_tasks;
			queueMicrotask(() => {
				// If this is false, a flushSync happened in the meantime. Do _not_ run new scheduled microtasks in that case
				// as the ordering of microtasks would be broken at that point - consider this case:
				// - queue_micro_task schedules microtask A to flush task X
				// - synchronously after, flushSync runs, processing task X
				// - synchronously after, some other microtask B is scheduled, but not through queue_micro_task but for example a Promise.resolve() in user code
				// - synchronously after, queue_micro_task schedules microtask C to flush task Y
				// - one tick later, microtask A now resolves, flushing task Y before microtask B, which is incorrect
				// This if check prevents that race condition (that realistically will only happen in tests)
				if (tasks === micro_tasks) run_micro_tasks();
			});
		}

		micro_tasks.push(fn);
	}

	/** @import { Derived, Effect } from '#client' */
	/** @import { Boundary } from './dom/blocks/boundary.js' */

	/**
	 * @param {unknown} error
	 */
	function handle_error(error) {
		var effect = active_effect;

		// for unowned deriveds, don't throw until we read the value
		if (effect === null) {
			/** @type {Derived} */ (active_reaction).f |= ERROR_VALUE;
			return error;
		}

		// if the error occurred while creating this subtree, we let it
		// bubble up until it hits a boundary that can handle it, unless
		// it's an $effect in which case it doesn't run immediately
		if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {

			throw error;
		}

		// otherwise we bubble up the effect tree ourselves
		invoke_error_boundary(error, effect);
	}

	/**
	 * @param {unknown} error
	 * @param {Effect | null} effect
	 */
	function invoke_error_boundary(error, effect) {
		while (effect !== null) {
			if ((effect.f & BOUNDARY_EFFECT) !== 0) {
				if ((effect.f & REACTION_RAN) === 0) {
					// we are still creating the boundary effect
					throw error;
				}

				try {
					/** @type {Boundary} */ (effect.b).error(error);
					return;
				} catch (e) {
					error = e;
				}
			}

			effect = effect.parent;
		}

		throw error;
	}

	/** @import { Derived, Signal } from '#client' */

	const STATUS_MASK = -7169;

	/**
	 * @param {Signal} signal
	 * @param {number} status
	 */
	function set_signal_status(signal, status) {
		signal.f = (signal.f & STATUS_MASK) | status;
	}

	/**
	 * Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
	 * @param {Derived} derived
	 */
	function update_derived_status(derived) {
		// Only mark as MAYBE_DIRTY if disconnected and has dependencies.
		if ((derived.f & CONNECTED) !== 0 || derived.deps === null) {
			set_signal_status(derived, CLEAN);
		} else {
			set_signal_status(derived, MAYBE_DIRTY);
		}
	}

	/** @import { Derived, Effect, Value } from '#client' */

	/**
	 * @param {Value[] | null} deps
	 */
	function clear_marked(deps) {
		if (deps === null) return;

		for (const dep of deps) {
			if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
				continue;
			}

			dep.f ^= WAS_MARKED;

			clear_marked(/** @type {Derived} */ (dep).deps);
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {Set<Effect>} dirty_effects
	 * @param {Set<Effect>} maybe_dirty_effects
	 */
	function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
		if ((effect.f & DIRTY) !== 0) {
			dirty_effects.add(effect);
		} else if ((effect.f & MAYBE_DIRTY) !== 0) {
			maybe_dirty_effects.add(effect);
		}

		// Since we're not executing these effects now, we need to clear any WAS_MARKED flags
		// so that other batches can correctly reach these effects during their own traversal
		clear_marked(effect.deps);

		// mark as clean so they get scheduled if they depend on pending async state
		set_signal_status(effect, CLEAN);
	}

	/** @import { Fork } from 'svelte' */
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/** @import { Boundary } from '../dom/blocks/boundary' */

	/** @type {Set<Batch>} */
	const batches = new Set();

	/** @type {Batch | null} */
	let current_batch = null;

	/**
	 * When time travelling (i.e. working in one batch, while other batches
	 * still have ongoing work), we ignore the real values of affected
	 * signals in favour of their values within the batch
	 * @type {Map<Value, any> | null}
	 */
	let batch_values = null;

	// TODO this should really be a property of `batch`
	/** @type {Effect[]} */
	let queued_root_effects = [];

	/** @type {Effect | null} */
	let last_scheduled_effect = null;

	let is_flushing = false;

	class Batch {
		committed = false;

		/**
		 * The current values of any sources that are updated in this batch
		 * They keys of this map are identical to `this.#previous`
		 * @type {Map<Source, any>}
		 */
		current = new Map();

		/**
		 * The values of any sources that are updated in this batch _before_ those updates took place.
		 * They keys of this map are identical to `this.#current`
		 * @type {Map<Source, any>}
		 */
		previous = new Map();

		/**
		 * When the batch is committed (and the DOM is updated), we need to remove old branches
		 * and append new ones by calling the functions added inside (if/each/key/etc) blocks
		 * @type {Set<() => void>}
		 */
		#commit_callbacks = new Set();

		/**
		 * If a fork is discarded, we need to destroy any effects that are no longer needed
		 * @type {Set<(batch: Batch) => void>}
		 */
		#discard_callbacks = new Set();

		/**
		 * The number of async effects that are currently in flight
		 */
		#pending = 0;

		/**
		 * The number of async effects that are currently in flight, _not_ inside a pending boundary
		 */
		#blocking_pending = 0;

		/**
		 * A deferred that resolves when the batch is committed, used with `settled()`
		 * TODO replace with Promise.withResolvers once supported widely enough
		 * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
		 */
		#deferred = null;

		/**
		 * Deferred effects (which run after async work has completed) that are DIRTY
		 * @type {Set<Effect>}
		 */
		#dirty_effects = new Set();

		/**
		 * Deferred effects that are MAYBE_DIRTY
		 * @type {Set<Effect>}
		 */
		#maybe_dirty_effects = new Set();

		/**
		 * A map of branches that still exist, but will be destroyed when this batch
		 * is committed — we skip over these during `process`.
		 * The value contains child effects that were dirty/maybe_dirty before being reset,
		 * so they can be rescheduled if the branch survives.
		 * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
		 */
		#skipped_branches = new Map();

		is_fork = false;

		#decrement_queued = false;

		is_deferred() {
			return this.is_fork || this.#blocking_pending > 0;
		}

		/**
		 * Add an effect to the #skipped_branches map and reset its children
		 * @param {Effect} effect
		 */
		skip_effect(effect) {
			if (!this.#skipped_branches.has(effect)) {
				this.#skipped_branches.set(effect, { d: [], m: [] });
			}
		}

		/**
		 * Remove an effect from the #skipped_branches map and reschedule
		 * any tracked dirty/maybe_dirty child effects
		 * @param {Effect} effect
		 */
		unskip_effect(effect) {
			var tracked = this.#skipped_branches.get(effect);
			if (tracked) {
				this.#skipped_branches.delete(effect);

				for (var e of tracked.d) {
					set_signal_status(e, DIRTY);
					schedule_effect(e);
				}

				for (e of tracked.m) {
					set_signal_status(e, MAYBE_DIRTY);
					schedule_effect(e);
				}
			}
		}

		/**
		 *
		 * @param {Effect[]} root_effects
		 */
		process(root_effects) {
			queued_root_effects = [];

			this.apply();

			/** @type {Effect[]} */
			var effects = [];

			/** @type {Effect[]} */
			var render_effects = [];

			for (const root of root_effects) {
				this.#traverse_effect_tree(root, effects, render_effects);
				// Note: #traverse_effect_tree runs block effects eagerly, which can schedule effects,
				// which means queued_root_effects now may be filled again.

				// Helpful for debugging reactivity loss that has to do with branches being skipped:
				// log_inconsistent_branches(root);
			}

			if (this.is_deferred()) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);

				for (const [e, t] of this.#skipped_branches) {
					reset_branch(e, t);
				}
			} else {
				// append/remove branches
				for (const fn of this.#commit_callbacks) fn();
				this.#commit_callbacks.clear();

				if (this.#pending === 0) {
					this.#commit();
				}
				current_batch = null;

				flush_queued_effects(render_effects);
				flush_queued_effects(effects);

				this.#deferred?.resolve();
			}

			batch_values = null;
		}

		/**
		 * Traverse the effect tree, executing effects or stashing
		 * them for later execution as appropriate
		 * @param {Effect} root
		 * @param {Effect[]} effects
		 * @param {Effect[]} render_effects
		 */
		#traverse_effect_tree(root, effects, render_effects) {
			root.f ^= CLEAN;

			var effect = root.first;

			/** @type {Effect | null} */
			var pending_boundary = null;

			while (effect !== null) {
				var flags = effect.f;
				var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
				var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;

				var skip = is_skippable_branch || (flags & INERT) !== 0 || this.#skipped_branches.has(effect);

				if (!skip && effect.fn !== null) {
					if (is_branch) {
						effect.f ^= CLEAN;
					} else if (
						pending_boundary !== null &&
						(flags & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0
					) {
						/** @type {Boundary} */ (pending_boundary.b).defer_effect(effect);
					} else if ((flags & EFFECT) !== 0) {
						effects.push(effect);
					} else if (is_dirty(effect)) {
						if ((flags & BLOCK_EFFECT) !== 0) this.#maybe_dirty_effects.add(effect);
						update_effect(effect);
					}

					var child = effect.first;

					if (child !== null) {
						effect = child;
						continue;
					}
				}

				var parent = effect.parent;
				effect = effect.next;

				while (effect === null && parent !== null) {
					if (parent === pending_boundary) {
						pending_boundary = null;
					}

					effect = parent.next;
					parent = parent.parent;
				}
			}
		}

		/**
		 * @param {Effect[]} effects
		 */
		#defer_effects(effects) {
			for (var i = 0; i < effects.length; i += 1) {
				defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
			}
		}

		/**
		 * Associate a change to a given source with the current
		 * batch, noting its previous and current values
		 * @param {Source} source
		 * @param {any} value
		 */
		capture(source, value) {
			if (value !== UNINITIALIZED && !this.previous.has(source)) {
				this.previous.set(source, value);
			}

			// Don't save errors in `batch_values`, or they won't be thrown in `runtime.js#get`
			if ((source.f & ERROR_VALUE) === 0) {
				this.current.set(source, source.v);
				batch_values?.set(source, source.v);
			}
		}

		activate() {
			current_batch = this;
			this.apply();
		}

		deactivate() {
			// If we're not the current batch, don't deactivate,
			// else we could create zombie batches that are never flushed
			if (current_batch !== this) return;

			current_batch = null;
			batch_values = null;
		}

		flush() {
			this.activate();

			if (queued_root_effects.length > 0) {
				flush_effects();

				if (current_batch !== null && current_batch !== this) {
					// this can happen if a new batch was created during `flush_effects()`
					return;
				}
			} else if (this.#pending === 0) {
				this.process([]); // TODO this feels awkward
			}

			this.deactivate();
		}

		discard() {
			for (const fn of this.#discard_callbacks) fn(this);
			this.#discard_callbacks.clear();
		}

		#commit() {
			// If there are other pending batches, they now need to be 'rebased' —
			// in other words, we re-run block/async effects with the newly
			// committed state, unless the batch in question has a more
			// recent value for a given source
			if (batches.size > 1) {
				this.previous.clear();

				var previous_batch_values = batch_values;
				var is_earlier = true;

				for (const batch of batches) {
					if (batch === this) {
						is_earlier = false;
						continue;
					}

					/** @type {Source[]} */
					const sources = [];

					for (const [source, value] of this.current) {
						if (batch.current.has(source)) {
							if (is_earlier && value !== batch.current.get(source)) {
								// bring the value up to date
								batch.current.set(source, value);
							} else {
								// same value or later batch has more recent value,
								// no need to re-run these effects
								continue;
							}
						}

						sources.push(source);
					}

					if (sources.length === 0) {
						continue;
					}

					// Re-run async/block effects that depend on distinct values changed in both batches
					const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
					if (others.length > 0) {
						// Avoid running queued root effects on the wrong branch
						var prev_queued_root_effects = queued_root_effects;
						queued_root_effects = [];

						/** @type {Set<Value>} */
						const marked = new Set();
						/** @type {Map<Reaction, boolean>} */
						const checked = new Map();
						for (const source of sources) {
							mark_effects(source, others, marked, checked);
						}

						if (queued_root_effects.length > 0) {
							current_batch = batch;
							batch.apply();

							for (const root of queued_root_effects) {
								batch.#traverse_effect_tree(root, [], []);
							}

							// TODO do we need to do anything with the dummy effect arrays?

							batch.deactivate();
						}

						queued_root_effects = prev_queued_root_effects;
					}
				}

				current_batch = null;
				batch_values = previous_batch_values;
			}

			this.committed = true;
			batches.delete(this);
		}

		/**
		 *
		 * @param {boolean} blocking
		 */
		increment(blocking) {
			this.#pending += 1;
			if (blocking) this.#blocking_pending += 1;
		}

		/**
		 *
		 * @param {boolean} blocking
		 */
		decrement(blocking) {
			this.#pending -= 1;
			if (blocking) this.#blocking_pending -= 1;

			if (this.#decrement_queued) return;
			this.#decrement_queued = true;

			queue_micro_task(() => {
				this.#decrement_queued = false;

				if (!this.is_deferred()) {
					// we only reschedule previously-deferred effects if we expect
					// to be able to run them after processing the batch
					this.revive();
				} else if (queued_root_effects.length > 0) {
					// if other effects are scheduled, process the batch _without_
					// rescheduling the previously-deferred effects
					this.flush();
				}
			});
		}

		revive() {
			for (const e of this.#dirty_effects) {
				this.#maybe_dirty_effects.delete(e);
				set_signal_status(e, DIRTY);
				schedule_effect(e);
			}

			for (const e of this.#maybe_dirty_effects) {
				set_signal_status(e, MAYBE_DIRTY);
				schedule_effect(e);
			}

			this.flush();
		}

		/** @param {() => void} fn */
		oncommit(fn) {
			this.#commit_callbacks.add(fn);
		}

		/** @param {(batch: Batch) => void} fn */
		ondiscard(fn) {
			this.#discard_callbacks.add(fn);
		}

		settled() {
			return (this.#deferred ??= deferred()).promise;
		}

		static ensure() {
			if (current_batch === null) {
				const batch = (current_batch = new Batch());
				batches.add(current_batch);

				{
					queue_micro_task(() => {
						if (current_batch !== batch) {
							// a flushSync happened in the meantime
							return;
						}

						batch.flush();
					});
				}
			}

			return current_batch;
		}

		apply() {
			return;
		}
	}

	function flush_effects() {
		is_flushing = true;

		var source_stacks = null;

		try {
			var flush_count = 0;

			while (queued_root_effects.length > 0) {
				var batch = Batch.ensure();

				if (flush_count++ > 1000) {
					var updates, entry; if (DEV) ;

					infinite_loop_guard();
				}

				batch.process(queued_root_effects);
				old_values.clear();

				if (DEV) ;
			}
		} finally {
			queued_root_effects = [];

			is_flushing = false;
			last_scheduled_effect = null;
		}
	}

	function infinite_loop_guard() {
		try {
			effect_update_depth_exceeded();
		} catch (error) {

			// Best effort: invoke the boundary nearest the most recent
			// effect and hope that it's relevant to the infinite loop
			invoke_error_boundary(error, last_scheduled_effect);
		}
	}

	/** @type {Set<Effect> | null} */
	let eager_block_effects = null;

	/**
	 * @param {Array<Effect>} effects
	 * @returns {void}
	 */
	function flush_queued_effects(effects) {
		var length = effects.length;
		if (length === 0) return;

		var i = 0;

		while (i < length) {
			var effect = effects[i++];

			if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
				eager_block_effects = new Set();

				update_effect(effect);

				// Effects with no dependencies or teardown do not get added to the effect tree.
				// Deferred effects (e.g. `$effect(...)`) _are_ added to the tree because we
				// don't know if we need to keep them until they are executed. Doing the check
				// here (rather than in `update_effect`) allows us to skip the work for
				// immediate effects.
				if (
					effect.deps === null &&
					effect.first === null &&
					effect.nodes === null &&
					effect.teardown === null &&
					effect.ac === null
				) {
					// remove this effect from the graph
					unlink_effect(effect);
				}

				// If update_effect() has a flushSync() in it, we may have flushed another flush_queued_effects(),
				// which already handled this logic and did set eager_block_effects to null.
				if (eager_block_effects?.size > 0) {
					old_values.clear();

					for (const e of eager_block_effects) {
						// Skip eager effects that have already been unmounted
						if ((e.f & (DESTROYED | INERT)) !== 0) continue;

						// Run effects in order from ancestor to descendant, else we could run into nullpointers
						/** @type {Effect[]} */
						const ordered_effects = [e];
						let ancestor = e.parent;
						while (ancestor !== null) {
							if (eager_block_effects.has(ancestor)) {
								eager_block_effects.delete(ancestor);
								ordered_effects.push(ancestor);
							}
							ancestor = ancestor.parent;
						}

						for (let j = ordered_effects.length - 1; j >= 0; j--) {
							const e = ordered_effects[j];
							// Skip eager effects that have already been unmounted
							if ((e.f & (DESTROYED | INERT)) !== 0) continue;
							update_effect(e);
						}
					}

					eager_block_effects.clear();
				}
			}
		}

		eager_block_effects = null;
	}

	/**
	 * This is similar to `mark_reactions`, but it only marks async/block effects
	 * depending on `value` and at least one of the other `sources`, so that
	 * these effects can re-run after another batch has been committed
	 * @param {Value} value
	 * @param {Source[]} sources
	 * @param {Set<Value>} marked
	 * @param {Map<Reaction, boolean>} checked
	 */
	function mark_effects(value, sources, marked, checked) {
		if (marked.has(value)) return;
		marked.add(value);

		if (value.reactions !== null) {
			for (const reaction of value.reactions) {
				const flags = reaction.f;

				if ((flags & DERIVED) !== 0) {
					mark_effects(/** @type {Derived} */ (reaction), sources, marked, checked);
				} else if (
					(flags & (ASYNC | BLOCK_EFFECT)) !== 0 &&
					(flags & DIRTY) === 0 &&
					depends_on(reaction, sources, checked)
				) {
					set_signal_status(reaction, DIRTY);
					schedule_effect(/** @type {Effect} */ (reaction));
				}
			}
		}
	}

	/**
	 * @param {Reaction} reaction
	 * @param {Source[]} sources
	 * @param {Map<Reaction, boolean>} checked
	 */
	function depends_on(reaction, sources, checked) {
		const depends = checked.get(reaction);
		if (depends !== undefined) return depends;

		if (reaction.deps !== null) {
			for (const dep of reaction.deps) {
				if (includes.call(sources, dep)) {
					return true;
				}

				if ((dep.f & DERIVED) !== 0 && depends_on(/** @type {Derived} */ (dep), sources, checked)) {
					checked.set(/** @type {Derived} */ (dep), true);
					return true;
				}
			}
		}

		checked.set(reaction, false);

		return false;
	}

	/**
	 * @param {Effect} signal
	 * @returns {void}
	 */
	function schedule_effect(signal) {
		var effect = (last_scheduled_effect = signal);

		while (effect.parent !== null) {
			effect = effect.parent;
			var flags = effect.f;

			// if the effect is being scheduled because a parent (each/await/etc) block
			// updated an internal source, or because a branch is being unskipped,
			// bail out or we'll cause a second flush
			if (
				is_flushing &&
				effect === active_effect &&
				(flags & BLOCK_EFFECT) !== 0 &&
				(flags & HEAD_EFFECT) === 0
			) {
				return;
			}

			if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
				if ((flags & CLEAN) === 0) return;
				effect.f ^= CLEAN;
			}
		}

		queued_root_effects.push(effect);
	}

	/**
	 * Mark all the effects inside a skipped branch CLEAN, so that
	 * they can be correctly rescheduled later. Tracks dirty and maybe_dirty
	 * effects so they can be rescheduled if the branch survives.
	 * @param {Effect} effect
	 * @param {{ d: Effect[], m: Effect[] }} tracked
	 */
	function reset_branch(effect, tracked) {
		// clean branch = nothing dirty inside, no need to traverse further
		if ((effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
			return;
		}

		if ((effect.f & DIRTY) !== 0) {
			tracked.d.push(effect);
		} else if ((effect.f & MAYBE_DIRTY) !== 0) {
			tracked.m.push(effect);
		}

		set_signal_status(effect, CLEAN);

		var e = effect.first;
		while (e !== null) {
			reset_branch(e, tracked);
			e = e.next;
		}
	}

	/**
	 * Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity.
	 * It's particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or `WebSocket`.
	 *
	 * If `subscribe` is called inside an effect (including indirectly, for example inside a getter),
	 * the `start` callback will be called with an `update` function. Whenever `update` is called, the effect re-runs.
	 *
	 * If `start` returns a cleanup function, it will be called when the effect is destroyed.
	 *
	 * If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
	 * are active, and the returned teardown function will only be called when all effects are destroyed.
	 *
	 * It's best understood with an example. Here's an implementation of [`MediaQuery`](https://svelte.dev/docs/svelte/svelte-reactivity#MediaQuery):
	 *
	 * ```js
	 * import { createSubscriber } from 'svelte/reactivity';
	 * import { on } from 'svelte/events';
	 *
	 * export class MediaQuery {
	 * 	#query;
	 * 	#subscribe;
	 *
	 * 	constructor(query) {
	 * 		this.#query = window.matchMedia(`(${query})`);
	 *
	 * 		this.#subscribe = createSubscriber((update) => {
	 * 			// when the `change` event occurs, re-run any effects that read `this.current`
	 * 			const off = on(this.#query, 'change', update);
	 *
	 * 			// stop listening when all the effects are destroyed
	 * 			return () => off();
	 * 		});
	 * 	}
	 *
	 * 	get current() {
	 * 		// This makes the getter reactive, if read in an effect
	 * 		this.#subscribe();
	 *
	 * 		// Return the current state of the query, whether or not we're in an effect
	 * 		return this.#query.matches;
	 * 	}
	 * }
	 * ```
	 * @param {(update: () => void) => (() => void) | void} start
	 * @since 5.7.0
	 */
	function createSubscriber(start) {
		let subscribers = 0;
		let version = source(0);
		/** @type {(() => void) | void} */
		let stop;

		return () => {
			if (effect_tracking()) {
				get$2(version);

				render_effect(() => {
					if (subscribers === 0) {
						stop = untrack(() => start(() => increment(version)));
					}

					subscribers += 1;

					return () => {
						queue_micro_task(() => {
							// Only count down after a microtask, else we would reach 0 before our own render effect reruns,
							// but reach 1 again when the tick callback of the prior teardown runs. That would mean we
							// re-subcribe unnecessarily and create a memory leak because the old subscription is never cleaned up.
							subscribers -= 1;

							if (subscribers === 0) {
								stop?.();
								stop = undefined;
								// Increment the version to ensure any dependent deriveds are marked dirty when the subscription is picked up again later.
								// If we didn't do this then the comparison of write versions would determine that the derived has a later version than
								// the subscriber, and it would not be re-run.
								increment(version);
							}
						});
					};
				});
			}
		};
	}

	/** @import { Blocker, Effect, Value } from '#client' */

	/**
	 * @param {Blocker[]} blockers
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {(values: Value[]) => any} fn
	 */
	function flatten(blockers, sync, async, fn) {
		const d = is_runes() ? derived : derived_safe_equal;

		// Filter out already-settled blockers - no need to wait for them
		var pending = blockers.filter((b) => !b.settled);

		if (async.length === 0 && pending.length === 0) {
			fn(sync.map(d));
			return;
		}

		var batch = current_batch;
		var parent = /** @type {Effect} */ (active_effect);

		var restore = capture();
		var blocker_promise =
			pending.length === 1
				? pending[0].promise
				: pending.length > 1
					? Promise.all(pending.map((b) => b.promise))
					: null;

		/** @param {Value[]} values */
		function finish(values) {
			restore();

			try {
				fn(values);
			} catch (error) {
				if ((parent.f & DESTROYED) === 0) {
					invoke_error_boundary(error, parent);
				}
			}

			batch?.deactivate();
			unset_context();
		}

		// Fast path: blockers but no async expressions
		if (async.length === 0) {
			/** @type {Promise<any>} */ (blocker_promise).then(() => finish(sync.map(d)));
			return;
		}

		// Full path: has async expressions
		function run() {
			restore();
			Promise.all(async.map((expression) => async_derived(expression)))
				.then((result) => finish([...sync.map(d), ...result]))
				.catch((error) => invoke_error_boundary(error, parent));
		}

		if (blocker_promise) {
			blocker_promise.then(run);
		} else {
			run();
		}
	}

	/**
	 * Captures the current effect context so that we can restore it after
	 * some asynchronous work has happened (so that e.g. `await a + b`
	 * causes `b` to be registered as a dependency).
	 */
	function capture() {
		var previous_effect = active_effect;
		var previous_reaction = active_reaction;
		var previous_component_context = component_context;
		var previous_batch = current_batch;

		return function restore(activate_batch = true) {
			set_active_effect(previous_effect);
			set_active_reaction(previous_reaction);
			set_component_context(previous_component_context);
			if (activate_batch) previous_batch?.activate();
		};
	}

	function unset_context() {
		set_active_effect(null);
		set_active_reaction(null);
		set_component_context(null);
	}

	/** @import { Derived, Effect, Source } from '#client' */
	/** @import { Batch } from './batch.js'; */

	/**
	 * @template V
	 * @param {() => V} fn
	 * @returns {Derived<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function derived(fn) {
		var flags = DERIVED | DIRTY;
		var parent_derived =
			active_reaction !== null && (active_reaction.f & DERIVED) !== 0
				? /** @type {Derived} */ (active_reaction)
				: null;

		if (active_effect !== null) {
			// Since deriveds are evaluated lazily, any effects created inside them are
			// created too late to ensure that the parent effect is added to the tree
			active_effect.f |= EFFECT_PRESERVED;
		}

		/** @type {Derived<V>} */
		const signal = {
			ctx: component_context,
			deps: null,
			effects: null,
			equals,
			f: flags,
			fn,
			reactions: null,
			rv: 0,
			v: /** @type {V} */ (UNINITIALIZED),
			wv: 0,
			parent: parent_derived ?? active_effect,
			ac: null
		};

		return signal;
	}

	/**
	 * @template V
	 * @param {() => V | Promise<V>} fn
	 * @param {string} [label]
	 * @param {string} [location] If provided, print a warning if the value is not read immediately after update
	 * @returns {Promise<Source<V>>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function async_derived(fn, label, location) {
		let parent = /** @type {Effect | null} */ (active_effect);

		if (parent === null) {
			async_derived_orphan();
		}

		var boundary = /** @type {Boundary} */ (parent.b);

		var promise = /** @type {Promise<V>} */ (/** @type {unknown} */ (undefined));
		var signal = source(/** @type {V} */ (UNINITIALIZED));

		// only suspend in async deriveds created on initialisation
		var should_suspend = !active_reaction;

		/** @type {Map<Batch, ReturnType<typeof deferred<V>>>} */
		var deferreds = new Map();

		async_effect(() => {

			/** @type {ReturnType<typeof deferred<V>>} */
			var d = deferred();
			promise = d.promise;

			try {
				// If this code is changed at some point, make sure to still access the then property
				// of fn() to read any signals it might access, so that we track them as dependencies.
				// We call `unset_context` to undo any `save` calls that happen inside `fn()`
				Promise.resolve(fn())
					.then(d.resolve, d.reject)
					.then(() => {
						if (batch === current_batch && batch.committed) {
							// if the batch was rejected as stale, we need to cleanup
							// after any `$.save(...)` calls inside `fn()`
							batch.deactivate();
						}

						unset_context();
					});
			} catch (error) {
				d.reject(error);
				unset_context();
			}

			var batch = /** @type {Batch} */ (current_batch);

			if (should_suspend) {
				var blocking = boundary.is_rendered();

				boundary.update_pending_count(1);
				batch.increment(blocking);

				deferreds.get(batch)?.reject(STALE_REACTION);
				deferreds.delete(batch); // delete to ensure correct order in Map iteration below
				deferreds.set(batch, d);
			}

			/**
			 * @param {any} value
			 * @param {unknown} error
			 */
			const handler = (value, error = undefined) => {

				batch.activate();

				if (error) {
					if (error !== STALE_REACTION) {
						signal.f |= ERROR_VALUE;

						// @ts-expect-error the error is the wrong type, but we don't care
						internal_set(signal, error);
					}
				} else {
					if ((signal.f & ERROR_VALUE) !== 0) {
						signal.f ^= ERROR_VALUE;
					}

					internal_set(signal, value);

					// All prior async derived runs are now stale
					for (const [b, d] of deferreds) {
						deferreds.delete(b);
						if (b === batch) break;
						d.reject(STALE_REACTION);
					}
				}

				if (should_suspend) {
					boundary.update_pending_count(-1);
					batch.decrement(blocking);
				}
			};

			d.promise.then(handler, (e) => handler(null, e || 'unknown'));
		});

		teardown(() => {
			for (const d of deferreds.values()) {
				d.reject(STALE_REACTION);
			}
		});

		return new Promise((fulfil) => {
			/** @param {Promise<V>} p */
			function next(p) {
				function go() {
					if (p === promise) {
						fulfil(signal);
					} else {
						// if the effect re-runs before the initial promise
						// resolves, delay resolution until we have a value
						next(promise);
					}
				}

				p.then(go, go);
			}

			next(promise);
		});
	}

	/**
	 * @template V
	 * @param {() => V} fn
	 * @returns {Derived<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function user_derived(fn) {
		const d = derived(fn);

		push_reaction_value(d);

		return d;
	}

	/**
	 * @template V
	 * @param {() => V} fn
	 * @returns {Derived<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function derived_safe_equal(fn) {
		const signal = derived(fn);
		signal.equals = safe_equals;
		return signal;
	}

	/**
	 * @param {Derived} derived
	 * @returns {void}
	 */
	function destroy_derived_effects(derived) {
		var effects = derived.effects;

		if (effects !== null) {
			derived.effects = null;

			for (var i = 0; i < effects.length; i += 1) {
				destroy_effect(/** @type {Effect} */ (effects[i]));
			}
		}
	}

	/**
	 * @param {Derived} derived
	 * @returns {Effect | null}
	 */
	function get_derived_parent_effect(derived) {
		var parent = derived.parent;
		while (parent !== null) {
			if ((parent.f & DERIVED) === 0) {
				// The original parent effect might've been destroyed but the derived
				// is used elsewhere now - do not return the destroyed effect in that case
				return (parent.f & DESTROYED) === 0 ? /** @type {Effect} */ (parent) : null;
			}
			parent = parent.parent;
		}
		return null;
	}

	/**
	 * @template T
	 * @param {Derived} derived
	 * @returns {T}
	 */
	function execute_derived(derived) {
		var value;
		var prev_active_effect = active_effect;

		set_active_effect(get_derived_parent_effect(derived));

		{
			try {
				derived.f &= ~WAS_MARKED;
				destroy_derived_effects(derived);
				value = update_reaction(derived);
			} finally {
				set_active_effect(prev_active_effect);
			}
		}

		return value;
	}

	/**
	 * @param {Derived} derived
	 * @returns {void}
	 */
	function update_derived(derived) {
		var value = execute_derived(derived);

		if (!derived.equals(value)) {
			derived.wv = increment_write_version();

			// in a fork, we don't update the underlying value, just `batch_values`.
			// the underlying value will be updated when the fork is committed.
			// otherwise, the next time we get here after a 'real world' state
			// change, `derived.equals` may incorrectly return `true`
			if (!current_batch?.is_fork || derived.deps === null) {
				derived.v = value;

				// deriveds without dependencies should never be recomputed
				if (derived.deps === null) {
					set_signal_status(derived, CLEAN);
					return;
				}
			}
		}

		// don't mark derived clean if we're reading it inside a
		// cleanup function, or it will cache a stale value
		if (is_destroying_effect) {
			return;
		}

		// During time traveling we don't want to reset the status so that
		// traversal of the graph in the other batches still happens
		if (batch_values !== null) {
			// only cache the value if we're in a tracking context, otherwise we won't
			// clear the cache in `mark_reactions` when dependencies are updated
			if (effect_tracking() || current_batch?.is_fork) {
				batch_values.set(derived, value);
			}
		} else {
			update_derived_status(derived);
		}
	}

	/**
	 * @param {Derived} derived
	 */
	function freeze_derived_effects(derived) {
		if (derived.effects === null) return;

		for (const e of derived.effects) {
			// if the effect has a teardown function or abort signal, call it
			if (e.teardown || e.ac) {
				e.teardown?.();
				e.ac?.abort(STALE_REACTION);

				// make it a noop so it doesn't get called again if the derived
				// is unfrozen. we don't set it to `null`, because the existence
				// of a teardown function is what determines whether the
				// effect runs again during unfreezing
				e.teardown = noop$1;
				e.ac = null;

				remove_reactions(e, 0);
				destroy_effect_children(e);
			}
		}
	}

	/**
	 * @param {Derived} derived
	 */
	function unfreeze_derived_effects(derived) {
		if (derived.effects === null) return;

		for (const e of derived.effects) {
			// if the effect was previously frozen — indicated by the presence
			// of a teardown function — unfreeze it
			if (e.teardown) {
				update_effect(e);
			}
		}
	}

	/** @import { Derived, Effect, Source, Value } from '#client' */

	/** @type {Set<any>} */
	let eager_effects = new Set();

	/** @type {Map<Source, any>} */
	const old_values = new Map();

	let eager_effects_deferred = false;

	/**
	 * @template V
	 * @param {V} v
	 * @param {Error | null} [stack]
	 * @returns {Source<V>}
	 */
	// TODO rename this to `state` throughout the codebase
	function source(v, stack) {
		/** @type {Value} */
		var signal = {
			f: 0, // TODO ideally we could skip this altogether, but it causes type errors
			v,
			reactions: null,
			equals,
			rv: 0,
			wv: 0
		};

		return signal;
	}

	/**
	 * @template V
	 * @param {V} v
	 * @param {Error | null} [stack]
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function state(v, stack) {
		const s = source(v);

		push_reaction_value(s);

		return s;
	}

	/**
	 * @template V
	 * @param {V} initial_value
	 * @param {boolean} [immutable]
	 * @returns {Source<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function mutable_source(initial_value, immutable = false, trackable = true) {
		const s = source(initial_value);
		if (!immutable) {
			s.equals = safe_equals;
		}

		// bind the signal to the component context, in case we need to
		// track updates to trigger beforeUpdate/afterUpdate callbacks
		if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
			(component_context.l.s ??= []).push(s);
		}

		return s;
	}

	/**
	 * @template V
	 * @param {Source<V>} source
	 * @param {V} value
	 * @param {boolean} [should_proxy]
	 * @returns {V}
	 */
	function set$2(source, value, should_proxy = false) {
		if (
			active_reaction !== null &&
			// since we are untracking the function inside `$inspect.with` we need to add this check
			// to ensure we error if state is set inside an inspect effect
			(!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) &&
			is_runes() &&
			(active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 &&
			(current_sources === null || !includes.call(current_sources, source))
		) {
			state_unsafe_mutation();
		}

		let new_value = should_proxy ? proxy(value) : value;

		return internal_set(source, new_value);
	}

	/**
	 * @template V
	 * @param {Source<V>} source
	 * @param {V} value
	 * @returns {V}
	 */
	function internal_set(source, value) {
		if (!source.equals(value)) {
			var old_value = source.v;

			if (is_destroying_effect) {
				old_values.set(source, value);
			} else {
				old_values.set(source, old_value);
			}

			source.v = value;

			var batch = Batch.ensure();
			batch.capture(source, old_value);

			if ((source.f & DERIVED) !== 0) {
				const derived = /** @type {Derived} */ (source);

				// if we are assigning to a dirty derived we set it to clean/maybe dirty but we also eagerly execute it to track the dependencies
				if ((source.f & DIRTY) !== 0) {
					execute_derived(derived);
				}

				update_derived_status(derived);
			}

			source.wv = increment_write_version();

			// For debugging, in case you want to know which reactions are being scheduled:
			// log_reactions(source);
			mark_reactions(source, DIRTY);

			// It's possible that the current reaction might not have up-to-date dependencies
			// whilst it's actively running. So in the case of ensuring it registers the reaction
			// properly for itself, we need to ensure the current effect actually gets
			// scheduled. i.e: `$effect(() => x++)`
			if (
				is_runes() &&
				active_effect !== null &&
				(active_effect.f & CLEAN) !== 0 &&
				(active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0
			) {
				if (untracked_writes === null) {
					set_untracked_writes([source]);
				} else {
					untracked_writes.push(source);
				}
			}

			if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
				flush_eager_effects();
			}
		}

		return value;
	}

	function flush_eager_effects() {
		eager_effects_deferred = false;

		for (const effect of eager_effects) {
			// Mark clean inspect-effects as maybe dirty and then check their dirtiness
			// instead of just updating the effects - this way we avoid overfiring.
			if ((effect.f & CLEAN) !== 0) {
				set_signal_status(effect, MAYBE_DIRTY);
			}

			if (is_dirty(effect)) {
				update_effect(effect);
			}
		}

		eager_effects.clear();
	}

	/**
	 * Silently (without using `get`) increment a source
	 * @param {Source<number>} source
	 */
	function increment(source) {
		set$2(source, source.v + 1);
	}

	/**
	 * @param {Value} signal
	 * @param {number} status should be DIRTY or MAYBE_DIRTY
	 * @returns {void}
	 */
	function mark_reactions(signal, status) {
		var reactions = signal.reactions;
		if (reactions === null) return;

		var runes = is_runes();
		var length = reactions.length;

		for (var i = 0; i < length; i++) {
			var reaction = reactions[i];
			var flags = reaction.f;

			// In legacy mode, skip the current effect to prevent infinite loops
			if (!runes && reaction === active_effect) continue;

			var not_dirty = (flags & DIRTY) === 0;

			// don't set a DIRTY reaction to MAYBE_DIRTY
			if (not_dirty) {
				set_signal_status(reaction, status);
			}

			if ((flags & DERIVED) !== 0) {
				var derived = /** @type {Derived} */ (reaction);

				batch_values?.delete(derived);

				if ((flags & WAS_MARKED) === 0) {
					// Only connected deriveds can be reliably unmarked right away
					if (flags & CONNECTED) {
						reaction.f |= WAS_MARKED;
					}

					mark_reactions(derived, MAYBE_DIRTY);
				}
			} else if (not_dirty) {
				if ((flags & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
					eager_block_effects.add(/** @type {Effect} */ (reaction));
				}

				schedule_effect(/** @type {Effect} */ (reaction));
			}
		}
	}

	/** @import { Source } from '#client' */

	/**
	 * @template T
	 * @param {T} value
	 * @returns {T}
	 */
	function proxy(value) {
		// if non-proxyable, or is already a proxy, return `value`
		if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
			return value;
		}

		const prototype = get_prototype_of(value);

		if (prototype !== object_prototype && prototype !== array_prototype) {
			return value;
		}

		/** @type {Map<any, Source<any>>} */
		var sources = new Map();
		var is_proxied_array = is_array(value);
		var version = state(0);
		var parent_version = update_version;

		/**
		 * Executes the proxy in the context of the reaction it was originally created in, if any
		 * @template T
		 * @param {() => T} fn
		 */
		var with_parent = (fn) => {
			if (update_version === parent_version) {
				return fn();
			}

			// child source is being created after the initial proxy —
			// prevent it from being associated with the current reaction
			var reaction = active_reaction;
			var version = update_version;

			set_active_reaction(null);
			set_update_version(parent_version);

			var result = fn();

			set_active_reaction(reaction);
			set_update_version(version);

			return result;
		};

		if (is_proxied_array) {
			// We need to create the length source eagerly to ensure that
			// mutations to the array are properly synced with our proxy
			sources.set('length', state(/** @type {any[]} */ (value).length));
		}

		return new Proxy(/** @type {any} */ (value), {
			defineProperty(_, prop, descriptor) {
				if (
					!('value' in descriptor) ||
					descriptor.configurable === false ||
					descriptor.enumerable === false ||
					descriptor.writable === false
				) {
					// we disallow non-basic descriptors, because unless they are applied to the
					// target object — which we avoid, so that state can be forked — we will run
					// afoul of the various invariants
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor#invariants
					state_descriptors_fixed();
				}
				var s = sources.get(prop);
				if (s === undefined) {
					with_parent(() => {
						var s = state(descriptor.value);
						sources.set(prop, s);
						return s;
					});
				} else {
					set$2(s, descriptor.value, true);
				}

				return true;
			},

			deleteProperty(target, prop) {
				var s = sources.get(prop);

				if (s === undefined) {
					if (prop in target) {
						const s = with_parent(() => state(UNINITIALIZED));
						sources.set(prop, s);
						increment(version);
					}
				} else {
					set$2(s, UNINITIALIZED);
					increment(version);
				}

				return true;
			},

			get(target, prop, receiver) {
				if (prop === STATE_SYMBOL) {
					return value;
				}

				var s = sources.get(prop);
				var exists = prop in target;

				// create a source, but only if it's an own property and not a prototype property
				if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
					s = with_parent(() => {
						var p = proxy(exists ? target[prop] : UNINITIALIZED);
						var s = state(p);

						return s;
					});

					sources.set(prop, s);
				}

				if (s !== undefined) {
					var v = get$2(s);
					return v === UNINITIALIZED ? undefined : v;
				}

				return Reflect.get(target, prop, receiver);
			},

			getOwnPropertyDescriptor(target, prop) {
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

				if (descriptor && 'value' in descriptor) {
					var s = sources.get(prop);
					if (s) descriptor.value = get$2(s);
				} else if (descriptor === undefined) {
					var source = sources.get(prop);
					var value = source?.v;

					if (source !== undefined && value !== UNINITIALIZED) {
						return {
							enumerable: true,
							configurable: true,
							value,
							writable: true
						};
					}
				}

				return descriptor;
			},

			has(target, prop) {
				if (prop === STATE_SYMBOL) {
					return true;
				}

				var s = sources.get(prop);
				var has = (s !== undefined && s.v !== UNINITIALIZED) || Reflect.has(target, prop);

				if (
					s !== undefined ||
					(active_effect !== null && (!has || get_descriptor(target, prop)?.writable))
				) {
					if (s === undefined) {
						s = with_parent(() => {
							var p = has ? proxy(target[prop]) : UNINITIALIZED;
							var s = state(p);

							return s;
						});

						sources.set(prop, s);
					}

					var value = get$2(s);
					if (value === UNINITIALIZED) {
						return false;
					}
				}

				return has;
			},

			set(target, prop, value, receiver) {
				var s = sources.get(prop);
				var has = prop in target;

				// variable.length = value -> clear all signals with index >= value
				if (is_proxied_array && prop === 'length') {
					for (var i = value; i < /** @type {Source<number>} */ (s).v; i += 1) {
						var other_s = sources.get(i + '');
						if (other_s !== undefined) {
							set$2(other_s, UNINITIALIZED);
						} else if (i in target) {
							// If the item exists in the original, we need to create an uninitialized source,
							// else a later read of the property would result in a source being created with
							// the value of the original item at that index.
							other_s = with_parent(() => state(UNINITIALIZED));
							sources.set(i + '', other_s);
						}
					}
				}

				// If we haven't yet created a source for this property, we need to ensure
				// we do so otherwise if we read it later, then the write won't be tracked and
				// the heuristics of effects will be different vs if we had read the proxied
				// object property before writing to that property.
				if (s === undefined) {
					if (!has || get_descriptor(target, prop)?.writable) {
						s = with_parent(() => state(undefined));
						set$2(s, proxy(value));

						sources.set(prop, s);
					}
				} else {
					has = s.v !== UNINITIALIZED;

					var p = with_parent(() => proxy(value));
					set$2(s, p);
				}

				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

				// Set the new value before updating any signals so that any listeners get the new value
				if (descriptor?.set) {
					descriptor.set.call(receiver, value);
				}

				if (!has) {
					// If we have mutated an array directly, we might need to
					// signal that length has also changed. Do it before updating metadata
					// to ensure that iterating over the array as a result of a metadata update
					// will not cause the length to be out of sync.
					if (is_proxied_array && typeof prop === 'string') {
						var ls = /** @type {Source<number>} */ (sources.get('length'));
						var n = Number(prop);

						if (Number.isInteger(n) && n >= ls.v) {
							set$2(ls, n + 1);
						}
					}

					increment(version);
				}

				return true;
			},

			ownKeys(target) {
				get$2(version);

				var own_keys = Reflect.ownKeys(target).filter((key) => {
					var source = sources.get(key);
					return source === undefined || source.v !== UNINITIALIZED;
				});

				for (var [key, source] of sources) {
					if (source.v !== UNINITIALIZED && !(key in target)) {
						own_keys.push(key);
					}
				}

				return own_keys;
			},

			setPrototypeOf() {
				state_prototype_fixed();
			}
		});
	}

	/**
	 * @param {any} value
	 */
	function get_proxied_value(value) {
		try {
			if (value !== null && typeof value === 'object' && STATE_SYMBOL in value) {
				return value[STATE_SYMBOL];
			}
		} catch {
			// the above if check can throw an error if the value in question
			// is the contentWindow of an iframe on another domain, in which
			// case we want to just return the value (because it's definitely
			// not a proxied value) so we don't break any JavaScript interacting
			// with that iframe (such as various payment companies client side
			// JavaScript libraries interacting with their iframes on the same
			// domain)
		}

		return value;
	}

	/**
	 * @param {any} a
	 * @param {any} b
	 */
	function is(a, b) {
		return Object.is(get_proxied_value(a), get_proxied_value(b));
	}

	/** @import { Effect, TemplateNode } from '#client' */

	// export these for reference in the compiled code, making global name deduplication unnecessary
	/** @type {Window} */
	var $window;

	/** @type {boolean} */
	var is_firefox;

	/** @type {() => Node | null} */
	var first_child_getter;
	/** @type {() => Node | null} */
	var next_sibling_getter;

	/**
	 * @param {string} value
	 * @returns {Text}
	 */
	function create_text(value = '') {
		return document.createTextNode(value);
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 */
	/*@__NO_SIDE_EFFECTS__*/
	function get_first_child(node) {
		return /** @type {TemplateNode | null} */ (first_child_getter.call(node));
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 */
	/*@__NO_SIDE_EFFECTS__*/
	function get_next_sibling(node) {
		return /** @type {TemplateNode | null} */ (next_sibling_getter.call(node));
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @template {Node} N
	 * @param {N} node
	 * @param {boolean} is_text
	 * @returns {TemplateNode | null}
	 */
	function child(node, is_text) {
		{
			return get_first_child(node);
		}
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @param {TemplateNode} node
	 * @param {boolean} [is_text]
	 * @returns {TemplateNode | null}
	 */
	function first_child(node, is_text = false) {
		{
			var first = get_first_child(node);

			// TODO prevent user comments with the empty string when preserveComments is true
			if (first instanceof Comment && first.data === '') return get_next_sibling(first);

			return first;
		}
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @param {TemplateNode} node
	 * @param {number} count
	 * @param {boolean} is_text
	 * @returns {TemplateNode | null}
	 */
	function sibling(node, count = 1, is_text = false) {
		let next_sibling = node;

		while (count--) {
			next_sibling = /** @type {TemplateNode} */ (get_next_sibling(next_sibling));
		}

		{
			return next_sibling;
		}
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 * @returns {void}
	 */
	function clear_text_content(node) {
		node.textContent = '';
	}

	/**
	 * Returns `true` if we're updating the current block, for example `condition` in
	 * an `{#if condition}` block just changed. In this case, the branch should be
	 * appended (or removed) at the same time as other updates within the
	 * current `<svelte:boundary>`
	 */
	function should_defer_append() {
		return false;
	}

	/**
	 * @template {keyof HTMLElementTagNameMap | string} T
	 * @param {T} tag
	 * @param {string} [namespace]
	 * @param {string} [is]
	 * @returns {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element}
	 */
	function create_element(tag, namespace, is) {
		let options = undefined;
		return /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */ (
			document.createElementNS(NAMESPACE_HTML, tag, options)
		);
	}

	/**
	 * @param {HTMLElement} dom
	 * @param {boolean} value
	 * @returns {void}
	 */
	function autofocus(dom, value) {
		if (value) {
			const body = document.body;
			dom.autofocus = true;

			queue_micro_task(() => {
				if (document.activeElement === body) {
					dom.focus();
				}
			});
		}
	}

	/**
	 * @template T
	 * @param {() => T} fn
	 */
	function without_reactive_context(fn) {
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);
		try {
			return fn();
		} finally {
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}

	/** @import { Blocker, ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */

	/**
	 * @param {'$effect' | '$effect.pre' | '$inspect'} rune
	 */
	function validate_effect(rune) {
		if (active_effect === null) {
			if (active_reaction === null) {
				effect_orphan();
			}

			effect_in_unowned_derived();
		}

		if (is_destroying_effect) {
			effect_in_teardown();
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {Effect} parent_effect
	 */
	function push_effect(effect, parent_effect) {
		var parent_last = parent_effect.last;
		if (parent_last === null) {
			parent_effect.last = parent_effect.first = effect;
		} else {
			parent_last.next = effect;
			effect.prev = parent_last;
			parent_effect.last = effect;
		}
	}

	/**
	 * @param {number} type
	 * @param {null | (() => void | (() => void))} fn
	 * @param {boolean} sync
	 * @returns {Effect}
	 */
	function create_effect(type, fn, sync) {
		var parent = active_effect;

		if (parent !== null && (parent.f & INERT) !== 0) {
			type |= INERT;
		}

		/** @type {Effect} */
		var effect = {
			ctx: component_context,
			deps: null,
			nodes: null,
			f: type | DIRTY | CONNECTED,
			first: null,
			fn,
			last: null,
			next: null,
			parent,
			b: parent && parent.b,
			prev: null,
			teardown: null,
			wv: 0,
			ac: null
		};

		if (sync) {
			try {
				update_effect(effect);
			} catch (e) {
				destroy_effect(effect);
				throw e;
			}
		} else if (fn !== null) {
			schedule_effect(effect);
		}

		/** @type {Effect | null} */
		var e = effect;

		// if an effect has already ran and doesn't need to be kept in the tree
		// (because it won't re-run, has no DOM, and has no teardown etc)
		// then we skip it and go to its child (if any)
		if (
			sync &&
			e.deps === null &&
			e.teardown === null &&
			e.nodes === null &&
			e.first === e.last && // either `null`, or a singular child
			(e.f & EFFECT_PRESERVED) === 0
		) {
			e = e.first;
			if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
				e.f |= EFFECT_TRANSPARENT;
			}
		}

		if (e !== null) {
			e.parent = parent;

			if (parent !== null) {
				push_effect(e, parent);
			}

			// if we're in a derived, add the effect there too
			if (
				active_reaction !== null &&
				(active_reaction.f & DERIVED) !== 0 &&
				(type & ROOT_EFFECT) === 0
			) {
				var derived = /** @type {Derived} */ (active_reaction);
				(derived.effects ??= []).push(e);
			}
		}

		return effect;
	}

	/**
	 * Internal representation of `$effect.tracking()`
	 * @returns {boolean}
	 */
	function effect_tracking() {
		return active_reaction !== null && !untracking;
	}

	/**
	 * @param {() => void} fn
	 */
	function teardown(fn) {
		const effect = create_effect(RENDER_EFFECT, null, false);
		set_signal_status(effect, CLEAN);
		effect.teardown = fn;
		return effect;
	}

	/**
	 * Internal representation of `$effect(...)`
	 * @param {() => void | (() => void)} fn
	 */
	function user_effect(fn) {
		validate_effect();

		// Non-nested `$effect(...)` in a component should be deferred
		// until the component is mounted
		var flags = /** @type {Effect} */ (active_effect).f;
		var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & REACTION_RAN) === 0;

		if (defer) {
			// Top-level `$effect(...)` in an unmounted component — defer until mount
			var context = /** @type {ComponentContext} */ (component_context);
			(context.e ??= []).push(fn);
		} else {
			// Everything else — create immediately
			return create_user_effect(fn);
		}
	}

	/**
	 * @param {() => void | (() => void)} fn
	 */
	function create_user_effect(fn) {
		return create_effect(EFFECT | USER_EFFECT, fn, false);
	}

	/**
	 * Internal representation of `$effect.pre(...)`
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function user_pre_effect(fn) {
		validate_effect();
		return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
	}

	/**
	 * Internal representation of `$effect.root(...)`
	 * @param {() => void | (() => void)} fn
	 * @returns {() => void}
	 */
	function effect_root(fn) {
		Batch.ensure();
		const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);

		return () => {
			destroy_effect(effect);
		};
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function effect(fn) {
		return create_effect(EFFECT, fn, false);
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function async_effect(fn) {
		return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function render_effect(fn, flags = 0) {
		return create_effect(RENDER_EFFECT | flags, fn, true);
	}

	/**
	 * @param {(...expressions: any) => void | (() => void)} fn
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {Blocker[]} blockers
	 */
	function template_effect(fn, sync = [], async = [], blockers = []) {
		flatten(blockers, sync, async, (values) => {
			create_effect(RENDER_EFFECT, () => fn(...values.map(get$2)), true);
		});
	}

	/**
	 * @param {(() => void)} fn
	 * @param {number} flags
	 */
	function block(fn, flags = 0) {
		var effect = create_effect(BLOCK_EFFECT | flags, fn, true);
		return effect;
	}

	/**
	 * @param {(() => void)} fn
	 * @param {number} flags
	 */
	function managed(fn, flags = 0) {
		var effect = create_effect(MANAGED_EFFECT | flags, fn, true);
		return effect;
	}

	/**
	 * @param {(() => void)} fn
	 */
	function branch(fn) {
		return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
	}

	/**
	 * @param {Effect} effect
	 */
	function execute_effect_teardown(effect) {
		var teardown = effect.teardown;
		if (teardown !== null) {
			const previously_destroying_effect = is_destroying_effect;
			const previous_reaction = active_reaction;
			set_is_destroying_effect(true);
			set_active_reaction(null);
			try {
				teardown.call(null);
			} finally {
				set_is_destroying_effect(previously_destroying_effect);
				set_active_reaction(previous_reaction);
			}
		}
	}

	/**
	 * @param {Effect} signal
	 * @param {boolean} remove_dom
	 * @returns {void}
	 */
	function destroy_effect_children(signal, remove_dom = false) {
		var effect = signal.first;
		signal.first = signal.last = null;

		while (effect !== null) {
			const controller = effect.ac;

			if (controller !== null) {
				without_reactive_context(() => {
					controller.abort(STALE_REACTION);
				});
			}

			var next = effect.next;

			if ((effect.f & ROOT_EFFECT) !== 0) {
				// this is now an independent root
				effect.parent = null;
			} else {
				destroy_effect(effect, remove_dom);
			}

			effect = next;
		}
	}

	/**
	 * @param {Effect} signal
	 * @returns {void}
	 */
	function destroy_block_effect_children(signal) {
		var effect = signal.first;

		while (effect !== null) {
			var next = effect.next;
			if ((effect.f & BRANCH_EFFECT) === 0) {
				destroy_effect(effect);
			}
			effect = next;
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {boolean} [remove_dom]
	 * @returns {void}
	 */
	function destroy_effect(effect, remove_dom = true) {
		var removed = false;

		if (
			(remove_dom || (effect.f & HEAD_EFFECT) !== 0) &&
			effect.nodes !== null &&
			effect.nodes.end !== null
		) {
			remove_effect_dom(effect.nodes.start, /** @type {TemplateNode} */ (effect.nodes.end));
			removed = true;
		}

		destroy_effect_children(effect, remove_dom && !removed);
		remove_reactions(effect, 0);
		set_signal_status(effect, DESTROYED);

		var transitions = effect.nodes && effect.nodes.t;

		if (transitions !== null) {
			for (const transition of transitions) {
				transition.stop();
			}
		}

		execute_effect_teardown(effect);

		var parent = effect.parent;

		// If the parent doesn't have any children, then skip this work altogether
		if (parent !== null && parent.first !== null) {
			unlink_effect(effect);
		}

		// `first` and `child` are nulled out in destroy_effect_children
		// we don't null out `parent` so that error propagation can work correctly
		effect.next =
			effect.prev =
			effect.teardown =
			effect.ctx =
			effect.deps =
			effect.fn =
			effect.nodes =
			effect.ac =
				null;
	}

	/**
	 *
	 * @param {TemplateNode | null} node
	 * @param {TemplateNode} end
	 */
	function remove_effect_dom(node, end) {
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : get_next_sibling(node);

			node.remove();
			node = next;
		}
	}

	/**
	 * Detach an effect from the effect tree, freeing up memory and
	 * reducing the amount of work that happens on subsequent traversals
	 * @param {Effect} effect
	 */
	function unlink_effect(effect) {
		var parent = effect.parent;
		var prev = effect.prev;
		var next = effect.next;

		if (prev !== null) prev.next = next;
		if (next !== null) next.prev = prev;

		if (parent !== null) {
			if (parent.first === effect) parent.first = next;
			if (parent.last === effect) parent.last = prev;
		}
	}

	/**
	 * When a block effect is removed, we don't immediately destroy it or yank it
	 * out of the DOM, because it might have transitions. Instead, we 'pause' it.
	 * It stays around (in memory, and in the DOM) until outro transitions have
	 * completed, and if the state change is reversed then we _resume_ it.
	 * A paused effect does not update, and the DOM subtree becomes inert.
	 * @param {Effect} effect
	 * @param {() => void} [callback]
	 * @param {boolean} [destroy]
	 */
	function pause_effect(effect, callback, destroy = true) {
		/** @type {TransitionManager[]} */
		var transitions = [];

		pause_children(effect, transitions, true);

		var fn = () => {
			if (destroy) destroy_effect(effect);
			if (callback) callback();
		};

		var remaining = transitions.length;
		if (remaining > 0) {
			var check = () => --remaining || fn();
			for (var transition of transitions) {
				transition.out(check);
			}
		} else {
			fn();
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {TransitionManager[]} transitions
	 * @param {boolean} local
	 */
	function pause_children(effect, transitions, local) {
		if ((effect.f & INERT) !== 0) return;
		effect.f ^= INERT;

		var t = effect.nodes && effect.nodes.t;

		if (t !== null) {
			for (const transition of t) {
				if (transition.is_global || local) {
					transitions.push(transition);
				}
			}
		}

		var child = effect.first;

		while (child !== null) {
			var sibling = child.next;
			var transparent =
				(child.f & EFFECT_TRANSPARENT) !== 0 ||
				// If this is a branch effect without a block effect parent,
				// it means the parent block effect was pruned. In that case,
				// transparency information was transferred to the branch effect.
				((child.f & BRANCH_EFFECT) !== 0 && (effect.f & BLOCK_EFFECT) !== 0);
			// TODO we don't need to call pause_children recursively with a linked list in place
			// it's slightly more involved though as we have to account for `transparent` changing
			// through the tree.
			pause_children(child, transitions, transparent ? local : false);
			child = sibling;
		}
	}

	/**
	 * The opposite of `pause_effect`. We call this if (for example)
	 * `x` becomes falsy then truthy: `{#if x}...{/if}`
	 * @param {Effect} effect
	 */
	function resume_effect(effect) {
		resume_children(effect, true);
	}

	/**
	 * @param {Effect} effect
	 * @param {boolean} local
	 */
	function resume_children(effect, local) {
		if ((effect.f & INERT) === 0) return;
		effect.f ^= INERT;

		// If a dependency of this effect changed while it was paused,
		// schedule the effect to update. we don't use `is_dirty`
		// here because we don't want to eagerly recompute a derived like
		// `{#if foo}{foo.bar()}{/if}` if `foo` is now `undefined
		if ((effect.f & CLEAN) === 0) {
			set_signal_status(effect, DIRTY);
			schedule_effect(effect);
		}

		var child = effect.first;

		while (child !== null) {
			var sibling = child.next;
			var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
			// TODO we don't need to call resume_children recursively with a linked list in place
			// it's slightly more involved though as we have to account for `transparent` changing
			// through the tree.
			resume_children(child, transparent ? local : false);
			child = sibling;
		}

		var t = effect.nodes && effect.nodes.t;

		if (t !== null) {
			for (const transition of t) {
				if (transition.is_global || local) {
					transition.in();
				}
			}
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {DocumentFragment} fragment
	 */
	function move_effect(effect, fragment) {
		if (!effect.nodes) return;

		/** @type {TemplateNode | null} */
		var node = effect.nodes.start;
		var end = effect.nodes.end;

		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : get_next_sibling(node);

			fragment.append(node);
			node = next;
		}
	}

	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */

	let is_updating_effect = false;

	let is_destroying_effect = false;

	/** @param {boolean} value */
	function set_is_destroying_effect(value) {
		is_destroying_effect = value;
	}

	/** @type {null | Reaction} */
	let active_reaction = null;

	let untracking = false;

	/** @param {null | Reaction} reaction */
	function set_active_reaction(reaction) {
		active_reaction = reaction;
	}

	/** @type {null | Effect} */
	let active_effect = null;

	/** @param {null | Effect} effect */
	function set_active_effect(effect) {
		active_effect = effect;
	}

	/**
	 * When sources are created within a reaction, reading and writing
	 * them within that reaction should not cause a re-run
	 * @type {null | Source[]}
	 */
	let current_sources = null;

	/** @param {Value} value */
	function push_reaction_value(value) {
		if (active_reaction !== null && (true)) {
			if (current_sources === null) {
				current_sources = [value];
			} else {
				current_sources.push(value);
			}
		}
	}

	/**
	 * The dependencies of the reaction that is currently being executed. In many cases,
	 * the dependencies are unchanged between runs, and so this will be `null` unless
	 * and until a new dependency is accessed — we track this via `skipped_deps`
	 * @type {null | Value[]}
	 */
	let new_deps = null;

	let skipped_deps = 0;

	/**
	 * Tracks writes that the effect it's executed in doesn't listen to yet,
	 * so that the dependency can be added to the effect later on if it then reads it
	 * @type {null | Source[]}
	 */
	let untracked_writes = null;

	/** @param {null | Source[]} value */
	function set_untracked_writes(value) {
		untracked_writes = value;
	}

	/**
	 * @type {number} Used by sources and deriveds for handling updates.
	 * Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
	 **/
	let write_version = 1;

	/** @type {number} Used to version each read of a source of derived to avoid duplicating depedencies inside a reaction */
	let read_version = 0;

	let update_version = read_version;

	/** @param {number} value */
	function set_update_version(value) {
		update_version = value;
	}

	function increment_write_version() {
		return ++write_version;
	}

	/**
	 * Determines whether a derived or effect is dirty.
	 * If it is MAYBE_DIRTY, will set the status to CLEAN
	 * @param {Reaction} reaction
	 * @returns {boolean}
	 */
	function is_dirty(reaction) {
		var flags = reaction.f;

		if ((flags & DIRTY) !== 0) {
			return true;
		}

		if (flags & DERIVED) {
			reaction.f &= ~WAS_MARKED;
		}

		if ((flags & MAYBE_DIRTY) !== 0) {
			var dependencies = /** @type {Value[]} */ (reaction.deps);
			var length = dependencies.length;

			for (var i = 0; i < length; i++) {
				var dependency = dependencies[i];

				if (is_dirty(/** @type {Derived} */ (dependency))) {
					update_derived(/** @type {Derived} */ (dependency));
				}

				if (dependency.wv > reaction.wv) {
					return true;
				}
			}

			if (
				(flags & CONNECTED) !== 0 &&
				// During time traveling we don't want to reset the status so that
				// traversal of the graph in the other batches still happens
				batch_values === null
			) {
				set_signal_status(reaction, CLEAN);
			}
		}

		return false;
	}

	/**
	 * @param {Value} signal
	 * @param {Effect} effect
	 * @param {boolean} [root]
	 */
	function schedule_possible_effect_self_invalidation(signal, effect, root = true) {
		var reactions = signal.reactions;
		if (reactions === null) return;

		if (current_sources !== null && includes.call(current_sources, signal)) {
			return;
		}

		for (var i = 0; i < reactions.length; i++) {
			var reaction = reactions[i];

			if ((reaction.f & DERIVED) !== 0) {
				schedule_possible_effect_self_invalidation(/** @type {Derived} */ (reaction), effect, false);
			} else if (effect === reaction) {
				if (root) {
					set_signal_status(reaction, DIRTY);
				} else if ((reaction.f & CLEAN) !== 0) {
					set_signal_status(reaction, MAYBE_DIRTY);
				}
				schedule_effect(/** @type {Effect} */ (reaction));
			}
		}
	}

	/** @param {Reaction} reaction */
	function update_reaction(reaction) {
		var previous_deps = new_deps;
		var previous_skipped_deps = skipped_deps;
		var previous_untracked_writes = untracked_writes;
		var previous_reaction = active_reaction;
		var previous_sources = current_sources;
		var previous_component_context = component_context;
		var previous_untracking = untracking;
		var previous_update_version = update_version;

		var flags = reaction.f;

		new_deps = /** @type {null | Value[]} */ (null);
		skipped_deps = 0;
		untracked_writes = null;
		active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;

		current_sources = null;
		set_component_context(reaction.ctx);
		untracking = false;
		update_version = ++read_version;

		if (reaction.ac !== null) {
			without_reactive_context(() => {
				/** @type {AbortController} */ (reaction.ac).abort(STALE_REACTION);
			});

			reaction.ac = null;
		}

		try {
			reaction.f |= REACTION_IS_UPDATING;
			var fn = /** @type {Function} */ (reaction.fn);
			var result = fn();
			reaction.f |= REACTION_RAN;
			var deps = reaction.deps;

			// Don't remove reactions during fork;
			// they must remain for when fork is discarded
			var is_fork = current_batch?.is_fork;

			if (new_deps !== null) {
				var i;

				if (!is_fork) {
					remove_reactions(reaction, skipped_deps);
				}

				if (deps !== null && skipped_deps > 0) {
					deps.length = skipped_deps + new_deps.length;
					for (i = 0; i < new_deps.length; i++) {
						deps[skipped_deps + i] = new_deps[i];
					}
				} else {
					reaction.deps = deps = new_deps;
				}

				if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
					for (i = skipped_deps; i < deps.length; i++) {
						(deps[i].reactions ??= []).push(reaction);
					}
				}
			} else if (!is_fork && deps !== null && skipped_deps < deps.length) {
				remove_reactions(reaction, skipped_deps);
				deps.length = skipped_deps;
			}

			// If we're inside an effect and we have untracked writes, then we need to
			// ensure that if any of those untracked writes result in re-invalidation
			// of the current effect, then that happens accordingly
			if (
				is_runes() &&
				untracked_writes !== null &&
				!untracking &&
				deps !== null &&
				(reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0
			) {
				for (i = 0; i < /** @type {Source[]} */ (untracked_writes).length; i++) {
					schedule_possible_effect_self_invalidation(
						untracked_writes[i],
						/** @type {Effect} */ (reaction)
					);
				}
			}

			// If we are returning to an previous reaction then
			// we need to increment the read version to ensure that
			// any dependencies in this reaction aren't marked with
			// the same version
			if (previous_reaction !== null && previous_reaction !== reaction) {
				read_version++;

				// update the `rv` of the previous reaction's deps — both existing and new —
				// so that they are not added again
				if (previous_reaction.deps !== null) {
					for (let i = 0; i < previous_skipped_deps; i += 1) {
						previous_reaction.deps[i].rv = read_version;
					}
				}

				if (previous_deps !== null) {
					for (const dep of previous_deps) {
						dep.rv = read_version;
					}
				}

				if (untracked_writes !== null) {
					if (previous_untracked_writes === null) {
						previous_untracked_writes = untracked_writes;
					} else {
						previous_untracked_writes.push(.../** @type {Source[]} */ (untracked_writes));
					}
				}
			}

			if ((reaction.f & ERROR_VALUE) !== 0) {
				reaction.f ^= ERROR_VALUE;
			}

			return result;
		} catch (error) {
			return handle_error(error);
		} finally {
			reaction.f ^= REACTION_IS_UPDATING;
			new_deps = previous_deps;
			skipped_deps = previous_skipped_deps;
			untracked_writes = previous_untracked_writes;
			active_reaction = previous_reaction;
			current_sources = previous_sources;
			set_component_context(previous_component_context);
			untracking = previous_untracking;
			update_version = previous_update_version;
		}
	}

	/**
	 * @template V
	 * @param {Reaction} signal
	 * @param {Value<V>} dependency
	 * @returns {void}
	 */
	function remove_reaction(signal, dependency) {
		let reactions = dependency.reactions;
		if (reactions !== null) {
			var index = index_of.call(reactions, signal);
			if (index !== -1) {
				var new_length = reactions.length - 1;
				if (new_length === 0) {
					reactions = dependency.reactions = null;
				} else {
					// Swap with last element and then remove.
					reactions[index] = reactions[new_length];
					reactions.pop();
				}
			}
		}

		// If the derived has no reactions, then we can disconnect it from the graph,
		// allowing it to either reconnect in the future, or be GC'd by the VM.
		if (
			reactions === null &&
			(dependency.f & DERIVED) !== 0 &&
			// Destroying a child effect while updating a parent effect can cause a dependency to appear
			// to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
			// allows us to skip the expensive work of disconnecting and immediately reconnecting it
			(new_deps === null || !includes.call(new_deps, dependency))
		) {
			var derived = /** @type {Derived} */ (dependency);

			// If we are working with a derived that is owned by an effect, then mark it as being
			// disconnected and remove the mark flag, as it cannot be reliably removed otherwise
			if ((derived.f & CONNECTED) !== 0) {
				derived.f ^= CONNECTED;
				derived.f &= ~WAS_MARKED;
			}

			update_derived_status(derived);

			// freeze any effects inside this derived
			freeze_derived_effects(derived);

			// Disconnect any reactions owned by this reaction
			remove_reactions(derived, 0);
		}
	}

	/**
	 * @param {Reaction} signal
	 * @param {number} start_index
	 * @returns {void}
	 */
	function remove_reactions(signal, start_index) {
		var dependencies = signal.deps;
		if (dependencies === null) return;

		for (var i = start_index; i < dependencies.length; i++) {
			remove_reaction(signal, dependencies[i]);
		}
	}

	/**
	 * @param {Effect} effect
	 * @returns {void}
	 */
	function update_effect(effect) {
		var flags = effect.f;

		if ((flags & DESTROYED) !== 0) {
			return;
		}

		set_signal_status(effect, CLEAN);

		var previous_effect = active_effect;
		var was_updating_effect = is_updating_effect;

		active_effect = effect;
		is_updating_effect = true;

		try {
			if ((flags & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
				destroy_block_effect_children(effect);
			} else {
				destroy_effect_children(effect);
			}

			execute_effect_teardown(effect);
			var teardown = update_reaction(effect);
			effect.teardown = typeof teardown === 'function' ? teardown : null;
			effect.wv = write_version;

			// In DEV, increment versions of any sources that were written to during the effect,
			// so that they are correctly marked as dirty when the effect re-runs
			var dep; if (DEV && tracing_mode_flag && (effect.f & DIRTY) !== 0 && effect.deps !== null) ;
		} finally {
			is_updating_effect = was_updating_effect;
			active_effect = previous_effect;
		}
	}

	/**
	 * @template V
	 * @param {Value<V>} signal
	 * @returns {V}
	 */
	function get$2(signal) {
		var flags = signal.f;
		var is_derived = (flags & DERIVED) !== 0;

		// Register the dependency on the current reaction signal.
		if (active_reaction !== null && !untracking) {
			// if we're in a derived that is being read inside an _async_ derived,
			// it's possible that the effect was already destroyed. In this case,
			// we don't add the dependency, because that would create a memory leak
			var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;

			if (!destroyed && (current_sources === null || !includes.call(current_sources, signal))) {
				var deps = active_reaction.deps;

				if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
					// we're in the effect init/update cycle
					if (signal.rv < read_version) {
						signal.rv = read_version;

						// If the signal is accessing the same dependencies in the same
						// order as it did last time, increment `skipped_deps`
						// rather than updating `new_deps`, which creates GC cost
						if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
							skipped_deps++;
						} else if (new_deps === null) {
							new_deps = [signal];
						} else {
							new_deps.push(signal);
						}
					}
				} else {
					// we're adding a dependency outside the init/update cycle
					// (i.e. after an `await`)
					(active_reaction.deps ??= []).push(signal);

					var reactions = signal.reactions;

					if (reactions === null) {
						signal.reactions = [active_reaction];
					} else if (!includes.call(reactions, active_reaction)) {
						reactions.push(active_reaction);
					}
				}
			}
		}

		if (is_destroying_effect && old_values.has(signal)) {
			return old_values.get(signal);
		}

		if (is_derived) {
			var derived = /** @type {Derived} */ (signal);

			if (is_destroying_effect) {
				var value = derived.v;

				// if the derived is dirty and has reactions, or depends on the values that just changed, re-execute
				// (a derived can be maybe_dirty due to the effect destroy removing its last reaction)
				if (
					((derived.f & CLEAN) === 0 && derived.reactions !== null) ||
					depends_on_old_values(derived)
				) {
					value = execute_derived(derived);
				}

				old_values.set(derived, value);

				return value;
			}

			// connect disconnected deriveds if we are reading them inside an effect,
			// or inside another derived that is already connected
			var should_connect =
				(derived.f & CONNECTED) === 0 &&
				!untracking &&
				active_reaction !== null &&
				(is_updating_effect || (active_reaction.f & CONNECTED) !== 0);

			var is_new = (derived.f & REACTION_RAN) === 0;

			if (is_dirty(derived)) {
				if (should_connect) {
					// set the flag before `update_derived`, so that the derived
					// is added as a reaction to its dependencies
					derived.f |= CONNECTED;
				}

				update_derived(derived);
			}

			if (should_connect && !is_new) {
				unfreeze_derived_effects(derived);
				reconnect(derived);
			}
		}

		if (batch_values?.has(signal)) {
			return batch_values.get(signal);
		}

		if ((signal.f & ERROR_VALUE) !== 0) {
			throw signal.v;
		}

		return signal.v;
	}

	/**
	 * (Re)connect a disconnected derived, so that it is notified
	 * of changes in `mark_reactions`
	 * @param {Derived} derived
	 */
	function reconnect(derived) {
		derived.f |= CONNECTED;

		if (derived.deps === null) return;

		for (const dep of derived.deps) {
			(dep.reactions ??= []).push(derived);

			if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
				unfreeze_derived_effects(/** @type {Derived} */ (dep));
				reconnect(/** @type {Derived} */ (dep));
			}
		}
	}

	/** @param {Derived} derived */
	function depends_on_old_values(derived) {
		if (derived.v === UNINITIALIZED) return true; // we don't know, so assume the worst
		if (derived.deps === null) return false;

		for (const dep of derived.deps) {
			if (old_values.has(dep)) {
				return true;
			}

			if ((dep.f & DERIVED) !== 0 && depends_on_old_values(/** @type {Derived} */ (dep))) {
				return true;
			}
		}

		return false;
	}

	/**
	 * When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
	 * any state read inside `fn` will not be treated as a dependency.
	 *
	 * ```ts
	 * $effect(() => {
	 *   // this will run when `data` changes, but not when `time` changes
	 *   save(data, {
	 *     timestamp: untrack(() => time)
	 *   });
	 * });
	 * ```
	 * @template T
	 * @param {() => T} fn
	 * @returns {T}
	 */
	function untrack(fn) {
		var previous_untracking = untracking;
		try {
			untracking = true;
			return fn();
		} finally {
			untracking = previous_untracking;
		}
	}

	/**
	 * @param {Record<string | symbol, unknown>} obj
	 * @param {Array<string | symbol>} keys
	 * @returns {Record<string | symbol, unknown>}
	 */
	function exclude_from_object(obj, keys) {
		/** @type {Record<string | symbol, unknown>} */
		var result = {};

		for (var key in obj) {
			if (!keys.includes(key)) {
				result[key] = obj[key];
			}
		}

		for (var symbol of Object.getOwnPropertySymbols(obj)) {
			if (Object.propertyIsEnumerable.call(obj, symbol) && !keys.includes(symbol)) {
				result[symbol] = obj[symbol];
			}
		}

		return result;
	}

	/**
	 * Possibly traverse an object and read all its properties so that they're all reactive in case this is `$state`.
	 * Does only check first level of an object for performance reasons (heuristic should be good for 99% of all cases).
	 * @param {any} value
	 * @returns {void}
	 */
	function deep_read_state(value) {
		if (typeof value !== 'object' || !value || value instanceof EventTarget) {
			return;
		}

		if (STATE_SYMBOL in value) {
			deep_read(value);
		} else if (!Array.isArray(value)) {
			for (let key in value) {
				const prop = value[key];
				if (typeof prop === 'object' && prop && STATE_SYMBOL in prop) {
					deep_read(prop);
				}
			}
		}
	}

	/**
	 * Deeply traverse an object and read all its properties
	 * so that they're all reactive in case this is `$state`
	 * @param {any} value
	 * @param {Set<any>} visited
	 * @returns {void}
	 */
	function deep_read(value, visited = new Set()) {
		if (
			typeof value === 'object' &&
			value !== null &&
			// We don't want to traverse DOM elements
			!(value instanceof EventTarget) &&
			!visited.has(value)
		) {
			visited.add(value);
			// When working with a possible SvelteDate, this
			// will ensure we capture changes to it.
			if (value instanceof Date) {
				value.getTime();
			}
			for (let key in value) {
				try {
					deep_read(value[key], visited);
				} catch (e) {
					// continue
				}
			}
			const proto = get_prototype_of(value);
			if (
				proto !== Object.prototype &&
				proto !== Array.prototype &&
				proto !== Map.prototype &&
				proto !== Set.prototype &&
				proto !== Date.prototype
			) {
				const descriptors = get_descriptors(proto);
				for (let key in descriptors) {
					const get = descriptors[key].get;
					if (get) {
						try {
							get.call(value);
						} catch (e) {
							// continue
						}
					}
				}
			}
		}
	}

	/** @type {Set<string>} */
	const all_registered_events = new Set();

	/** @type {Set<(events: Array<string>) => void>} */
	const root_event_handles = new Set();

	/**
	 * @param {string} event_name
	 * @param {EventTarget} dom
	 * @param {EventListener} [handler]
	 * @param {AddEventListenerOptions} [options]
	 */
	function create_event(event_name, dom, handler, options = {}) {
		/**
		 * @this {EventTarget}
		 */
		function target_handler(/** @type {Event} */ event) {
			if (!options.capture) {
				// Only call in the bubble phase, else delegated events would be called before the capturing events
				handle_event_propagation.call(dom, event);
			}
			if (!event.cancelBubble) {
				return without_reactive_context(() => {
					return handler?.call(this, event);
				});
			}
		}

		// Chrome has a bug where pointer events don't work when attached to a DOM element that has been cloned
		// with cloneNode() and the DOM element is disconnected from the document. To ensure the event works, we
		// defer the attachment till after it's been appended to the document. TODO: remove this once Chrome fixes
		// this bug. The same applies to wheel events and touch events.
		if (
			event_name.startsWith('pointer') ||
			event_name.startsWith('touch') ||
			event_name === 'wheel'
		) {
			queue_micro_task(() => {
				dom.addEventListener(event_name, target_handler, options);
			});
		} else {
			dom.addEventListener(event_name, target_handler, options);
		}

		return target_handler;
	}

	/**
	 * Attaches an event handler to an element and returns a function that removes the handler. Using this
	 * rather than `addEventListener` will preserve the correct order relative to handlers added declaratively
	 * (with attributes like `onclick`), which use event delegation for performance reasons
	 *
	 * @param {EventTarget} element
	 * @param {string} type
	 * @param {EventListener} handler
	 * @param {AddEventListenerOptions} [options]
	 */
	function on(element, type, handler, options = {}) {
		var target_handler = create_event(type, element, handler, options);

		return () => {
			element.removeEventListener(type, target_handler, options);
		};
	}

	/**
	 * @param {string} event_name
	 * @param {Element} dom
	 * @param {EventListener} [handler]
	 * @param {boolean} [capture]
	 * @param {boolean} [passive]
	 * @returns {void}
	 */
	function event(event_name, dom, handler, capture, passive) {
		var options = { capture, passive };
		var target_handler = create_event(event_name, dom, handler, options);

		if (
			dom === document.body ||
			// @ts-ignore
			dom === window ||
			// @ts-ignore
			dom === document ||
			// Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
			dom instanceof HTMLMediaElement
		) {
			teardown(() => {
				dom.removeEventListener(event_name, target_handler, options);
			});
		}
	}

	/**
	 * @param {Array<string>} events
	 * @returns {void}
	 */
	function delegate(events) {
		for (var i = 0; i < events.length; i++) {
			all_registered_events.add(events[i]);
		}

		for (var fn of root_event_handles) {
			fn(events);
		}
	}

	// used to store the reference to the currently propagated event
	// to prevent garbage collection between microtasks in Firefox
	// If the event object is GCed too early, the expando __root property
	// set on the event object is lost, causing the event delegation
	// to process the event twice
	let last_propagated_event = null;

	/**
	 * @this {EventTarget}
	 * @param {Event} event
	 * @returns {void}
	 */
	function handle_event_propagation(event) {
		var handler_element = this;
		var owner_document = /** @type {Node} */ (handler_element).ownerDocument;
		var event_name = event.type;
		var path = event.composedPath?.() || [];
		var current_target = /** @type {null | Element} */ (path[0] || event.target);

		last_propagated_event = event;

		// composedPath contains list of nodes the event has propagated through.
		// We check __root to skip all nodes below it in case this is a
		// parent of the __root node, which indicates that there's nested
		// mounted apps. In this case we don't want to trigger events multiple times.
		var path_idx = 0;

		// the `last_propagated_event === event` check is redundant, but
		// without it the variable will be DCE'd and things will
		// fail mysteriously in Firefox
		// @ts-expect-error is added below
		var handled_at = last_propagated_event === event && event.__root;

		if (handled_at) {
			var at_idx = path.indexOf(handled_at);
			if (
				at_idx !== -1 &&
				(handler_element === document || handler_element === /** @type {any} */ (window))
			) {
				// This is the fallback document listener or a window listener, but the event was already handled
				// -> ignore, but set handle_at to document/window so that we're resetting the event
				// chain in case someone manually dispatches the same event object again.
				// @ts-expect-error
				event.__root = handler_element;
				return;
			}

			// We're deliberately not skipping if the index is higher, because
			// someone could create an event programmatically and emit it multiple times,
			// in which case we want to handle the whole propagation chain properly each time.
			// (this will only be a false negative if the event is dispatched multiple times and
			// the fallback document listener isn't reached in between, but that's super rare)
			var handler_idx = path.indexOf(handler_element);
			if (handler_idx === -1) {
				// handle_idx can theoretically be -1 (happened in some JSDOM testing scenarios with an event listener on the window object)
				// so guard against that, too, and assume that everything was handled at this point.
				return;
			}

			if (at_idx <= handler_idx) {
				path_idx = at_idx;
			}
		}

		current_target = /** @type {Element} */ (path[path_idx] || event.target);
		// there can only be one delegated event per element, and we either already handled the current target,
		// or this is the very first target in the chain which has a non-delegated listener, in which case it's safe
		// to handle a possible delegated event on it later (through the root delegation listener for example).
		if (current_target === handler_element) return;

		// Proxy currentTarget to correct target
		define_property(event, 'currentTarget', {
			configurable: true,
			get() {
				return current_target || owner_document;
			}
		});

		// This started because of Chromium issue https://chromestatus.com/feature/5128696823545856,
		// where removal or moving of of the DOM can cause sync `blur` events to fire, which can cause logic
		// to run inside the current `active_reaction`, which isn't what we want at all. However, on reflection,
		// it's probably best that all event handled by Svelte have this behaviour, as we don't really want
		// an event handler to run in the context of another reaction or effect.
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);

		try {
			/**
			 * @type {unknown}
			 */
			var throw_error;
			/**
			 * @type {unknown[]}
			 */
			var other_errors = [];

			while (current_target !== null) {
				/** @type {null | Element} */
				var parent_element =
					current_target.assignedSlot ||
					current_target.parentNode ||
					/** @type {any} */ (current_target).host ||
					null;

				try {
					// @ts-expect-error
					var delegated = current_target['__' + event_name];

					if (
						delegated != null &&
						(!(/** @type {any} */ (current_target).disabled) ||
							// DOM could've been updated already by the time this is reached, so we check this as well
							// -> the target could not have been disabled because it emits the event in the first place
							event.target === current_target)
					) {
						delegated.call(current_target, event);
					}
				} catch (error) {
					if (throw_error) {
						other_errors.push(error);
					} else {
						throw_error = error;
					}
				}
				if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
					break;
				}
				current_target = parent_element;
			}

			if (throw_error) {
				for (let error of other_errors) {
					// Throw the rest of the errors, one-by-one on a microtask
					queueMicrotask(() => {
						throw error;
					});
				}
				throw throw_error;
			}
		} finally {
			// @ts-expect-error is used above
			event.__root = handler_element;
			// @ts-ignore remove proxy on currentTarget
			delete event.currentTarget;
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}

	/** @param {string} html */
	function create_fragment_from_html(html) {
		var elem = create_element('template');
		elem.innerHTML = html.replaceAll('<!>', '<!---->'); // XHTML compliance
		return elem.content;
	}

	/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
	/** @import { TemplateStructure } from './types' */

	/**
	 * @param {TemplateNode} start
	 * @param {TemplateNode | null} end
	 */
	function assign_nodes(start, end) {
		var effect = /** @type {Effect} */ (active_effect);
		if (effect.nodes === null) {
			effect.nodes = { start, end, a: null, t: null };
		}
	}

	/**
	 * @param {string} content
	 * @param {number} flags
	 * @returns {() => Node | Node[]}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function from_html(content, flags) {
		var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
		var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;

		/** @type {Node} */
		var node;

		/**
		 * Whether or not the first item is a text/element node. If not, we need to
		 * create an additional comment node to act as `effect.nodes.start`
		 */
		var has_start = !content.startsWith('<!>');

		return () => {

			if (node === undefined) {
				node = create_fragment_from_html(has_start ? content : '<!>' + content);
				if (!is_fragment) node = /** @type {TemplateNode} */ (get_first_child(node));
			}

			var clone = /** @type {TemplateNode} */ (
				use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
			);

			if (is_fragment) {
				var start = /** @type {TemplateNode} */ (get_first_child(clone));
				var end = /** @type {TemplateNode} */ (clone.lastChild);

				assign_nodes(start, end);
			} else {
				assign_nodes(clone, clone);
			}

			return clone;
		};
	}

	/**
	 * @param {string} content
	 * @param {number} flags
	 * @param {'svg' | 'math'} ns
	 * @returns {() => Node | Node[]}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function from_namespace(content, flags, ns = 'svg') {
		/**
		 * Whether or not the first item is a text/element node. If not, we need to
		 * create an additional comment node to act as `effect.nodes.start`
		 */
		var has_start = !content.startsWith('<!>');

		var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
		var wrapped = `<${ns}>${has_start ? content : '<!>' + content}</${ns}>`;

		/** @type {Element | DocumentFragment} */
		var node;

		return () => {

			if (!node) {
				var fragment = /** @type {DocumentFragment} */ (create_fragment_from_html(wrapped));
				var root = /** @type {Element} */ (get_first_child(fragment));

				if (is_fragment) {
					node = document.createDocumentFragment();
					while (get_first_child(root)) {
						node.appendChild(/** @type {TemplateNode} */ (get_first_child(root)));
					}
				} else {
					node = /** @type {Element} */ (get_first_child(root));
				}
			}

			var clone = /** @type {TemplateNode} */ (node.cloneNode(true));

			if (is_fragment) {
				var start = /** @type {TemplateNode} */ (get_first_child(clone));
				var end = /** @type {TemplateNode} */ (clone.lastChild);

				assign_nodes(start, end);
			} else {
				assign_nodes(clone, clone);
			}

			return clone;
		};
	}

	/**
	 * @param {string} content
	 * @param {number} flags
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function from_svg(content, flags) {
		return from_namespace(content, flags, 'svg');
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @param {any} value
	 */
	function text(value = '') {
		{
			var t = create_text(value + '');
			assign_nodes(t, t);
			return t;
		}
	}

	/**
	 * @returns {TemplateNode | DocumentFragment}
	 */
	function comment() {

		var frag = document.createDocumentFragment();
		var start = document.createComment('');
		var anchor = create_text();
		frag.append(start, anchor);

		assign_nodes(start, anchor);

		return frag;
	}

	/**
	 * Assign the created (or in hydration mode, traversed) dom elements to the current block
	 * and insert the elements into the dom (in client mode).
	 * @param {Text | Comment | Element} anchor
	 * @param {DocumentFragment | Element} dom
	 */
	function append(anchor, dom) {

		if (anchor === null) {
			// edge case — void `<svelte:element>` with content
			return;
		}

		anchor.before(/** @type {Node} */ (dom));
	}

	/**
	 * @param {string} name
	 */
	function is_capture_event(name) {
		return name.endsWith('capture') && name !== 'gotpointercapture' && name !== 'lostpointercapture';
	}

	/** List of Element events that will be delegated */
	const DELEGATED_EVENTS = [
		'beforeinput',
		'click',
		'change',
		'dblclick',
		'contextmenu',
		'focusin',
		'focusout',
		'input',
		'keydown',
		'keyup',
		'mousedown',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'pointerdown',
		'pointermove',
		'pointerout',
		'pointerover',
		'pointerup',
		'touchend',
		'touchmove',
		'touchstart'
	];

	/**
	 * Returns `true` if `event_name` is a delegated event
	 * @param {string} event_name
	 */
	function can_delegate_event(event_name) {
		return DELEGATED_EVENTS.includes(event_name);
	}

	/**
	 * @type {Record<string, string>}
	 * List of attribute names that should be aliased to their property names
	 * because they behave differently between setting them as an attribute and
	 * setting them as a property.
	 */
	const ATTRIBUTE_ALIASES = {
		// no `class: 'className'` because we handle that separately
		formnovalidate: 'formNoValidate',
		ismap: 'isMap',
		nomodule: 'noModule',
		playsinline: 'playsInline',
		readonly: 'readOnly',
		defaultvalue: 'defaultValue',
		defaultchecked: 'defaultChecked',
		srcobject: 'srcObject',
		novalidate: 'noValidate',
		allowfullscreen: 'allowFullscreen',
		disablepictureinpicture: 'disablePictureInPicture',
		disableremoteplayback: 'disableRemotePlayback'
	};

	/**
	 * @param {string} name
	 */
	function normalize_attribute(name) {
		name = name.toLowerCase();
		return ATTRIBUTE_ALIASES[name] ?? name;
	}

	/** @import { ComponentContext, Effect, EffectNodes, TemplateNode } from '#client' */
	/** @import { Component, ComponentType, SvelteComponent, MountOptions } from '../../index.js' */

	/**
	 * @param {Element} text
	 * @param {string} value
	 * @returns {void}
	 */
	function set_text(text, value) {
		// For objects, we apply string coercion (which might make things like $state array references in the template reactive) before diffing
		var str = value == null ? '' : typeof value === 'object' ? value + '' : value;
		// @ts-expect-error
		if (str !== (text.__t ??= text.nodeValue)) {
			// @ts-expect-error
			text.__t = str;
			text.nodeValue = str + '';
		}
	}

	/** @import { Effect, TemplateNode } from '#client' */

	/**
	 * @typedef {{ effect: Effect, fragment: DocumentFragment }} Branch
	 */

	/**
	 * @template Key
	 */
	class BranchManager {
		/** @type {TemplateNode} */
		anchor;

		/** @type {Map<Batch, Key>} */
		#batches = new Map();

		/**
		 * Map of keys to effects that are currently rendered in the DOM.
		 * These effects are visible and actively part of the document tree.
		 * Example:
		 * ```
		 * {#if condition}
		 * 	foo
		 * {:else}
		 * 	bar
		 * {/if}
		 * ```
		 * Can result in the entries `true->Effect` and `false->Effect`
		 * @type {Map<Key, Effect>}
		 */
		#onscreen = new Map();

		/**
		 * Similar to #onscreen with respect to the keys, but contains branches that are not yet
		 * in the DOM, because their insertion is deferred.
		 * @type {Map<Key, Branch>}
		 */
		#offscreen = new Map();

		/**
		 * Keys of effects that are currently outroing
		 * @type {Set<Key>}
		 */
		#outroing = new Set();

		/**
		 * Whether to pause (i.e. outro) on change, or destroy immediately.
		 * This is necessary for `<svelte:element>`
		 */
		#transition = true;

		/**
		 * @param {TemplateNode} anchor
		 * @param {boolean} transition
		 */
		constructor(anchor, transition = true) {
			this.anchor = anchor;
			this.#transition = transition;
		}

		#commit = () => {
			var batch = /** @type {Batch} */ (current_batch);

			// if this batch was made obsolete, bail
			if (!this.#batches.has(batch)) return;

			var key = /** @type {Key} */ (this.#batches.get(batch));

			var onscreen = this.#onscreen.get(key);

			if (onscreen) {
				// effect is already in the DOM — abort any current outro
				resume_effect(onscreen);
				this.#outroing.delete(key);
			} else {
				// effect is currently offscreen. put it in the DOM
				var offscreen = this.#offscreen.get(key);

				if (offscreen) {
					this.#onscreen.set(key, offscreen.effect);
					this.#offscreen.delete(key);

					// remove the anchor...
					/** @type {TemplateNode} */ (offscreen.fragment.lastChild).remove();

					// ...and append the fragment
					this.anchor.before(offscreen.fragment);
					onscreen = offscreen.effect;
				}
			}

			for (const [b, k] of this.#batches) {
				this.#batches.delete(b);

				if (b === batch) {
					// keep values for newer batches
					break;
				}

				const offscreen = this.#offscreen.get(k);

				if (offscreen) {
					// for older batches, destroy offscreen effects
					// as they will never be committed
					destroy_effect(offscreen.effect);
					this.#offscreen.delete(k);
				}
			}

			// outro/destroy all onscreen effects...
			for (const [k, effect] of this.#onscreen) {
				// ...except the one that was just committed
				//    or those that are already outroing (else the transition is aborted and the effect destroyed right away)
				if (k === key || this.#outroing.has(k)) continue;

				const on_destroy = () => {
					const keys = Array.from(this.#batches.values());

					if (keys.includes(k)) {
						// keep the effect offscreen, as another batch will need it
						var fragment = document.createDocumentFragment();
						move_effect(effect, fragment);

						fragment.append(create_text()); // TODO can we avoid this?

						this.#offscreen.set(k, { effect, fragment });
					} else {
						destroy_effect(effect);
					}

					this.#outroing.delete(k);
					this.#onscreen.delete(k);
				};

				if (this.#transition || !onscreen) {
					this.#outroing.add(k);
					pause_effect(effect, on_destroy, false);
				} else {
					on_destroy();
				}
			}
		};

		/**
		 * @param {Batch} batch
		 */
		#discard = (batch) => {
			this.#batches.delete(batch);

			const keys = Array.from(this.#batches.values());

			for (const [k, branch] of this.#offscreen) {
				if (!keys.includes(k)) {
					destroy_effect(branch.effect);
					this.#offscreen.delete(k);
				}
			}
		};

		/**
		 *
		 * @param {any} key
		 * @param {null | ((target: TemplateNode) => void)} fn
		 */
		ensure(key, fn) {
			var batch = /** @type {Batch} */ (current_batch);
			var defer = should_defer_append();

			if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
				if (defer) {
					var fragment = document.createDocumentFragment();
					var target = create_text();

					fragment.append(target);

					this.#offscreen.set(key, {
						effect: branch(() => fn(target)),
						fragment
					});
				} else {
					this.#onscreen.set(
						key,
						branch(() => fn(this.anchor))
					);
				}
			}

			this.#batches.set(batch, key);

			if (defer) {
				for (const [k, effect] of this.#onscreen) {
					if (k === key) {
						batch.unskip_effect(effect);
					} else {
						batch.skip_effect(effect);
					}
				}

				for (const [k, branch] of this.#offscreen) {
					if (k === key) {
						batch.unskip_effect(branch.effect);
					} else {
						batch.skip_effect(branch.effect);
					}
				}

				batch.oncommit(this.#commit);
				batch.ondiscard(this.#discard);
			} else {

				this.#commit();
			}
		}
	}

	/** @import { Snippet } from 'svelte' */
	/** @import { TemplateNode } from '#client' */
	/** @import { Getters } from '#shared' */

	/**
	 * @template {(node: TemplateNode, ...args: any[]) => void} SnippetFn
	 * @param {TemplateNode} node
	 * @param {() => SnippetFn | null | undefined} get_snippet
	 * @param {(() => any)[]} args
	 * @returns {void}
	 */
	function snippet(node, get_snippet, ...args) {
		var branches = new BranchManager(node);

		block(() => {
			const snippet = get_snippet() ?? null;

			branches.ensure(snippet, snippet && ((anchor) => snippet(anchor, ...args)));
		}, EFFECT_TRANSPARENT);
	}

	/** @import { ComponentContext, ComponentContextLegacy } from '#client' */
	/** @import { EventDispatcher } from './index.js' */
	/** @import { NotFunction } from './internal/types.js' */

	/**
	 * `onMount`, like [`$effect`](https://svelte.dev/docs/svelte/$effect), schedules a function to run as soon as the component has been mounted to the DOM.
	 * Unlike `$effect`, the provided function only runs once.
	 *
	 * It must be called during the component's initialisation (but doesn't need to live _inside_ the component;
	 * it can be called from an external module). If a function is returned _synchronously_ from `onMount`,
	 * it will be called when the component is unmounted.
	 *
	 * `onMount` functions do not run during [server-side rendering](https://svelte.dev/docs/svelte/svelte-server#render).
	 *
	 * @template T
	 * @param {() => NotFunction<T> | Promise<NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		if (component_context === null) {
			lifecycle_outside_component();
		}

		if (legacy_mode_flag && component_context.l !== null) {
			init_update_callbacks(component_context).m.push(fn);
		} else {
			user_effect(() => {
				const cleanup = untrack(fn);
				if (typeof cleanup === 'function') return /** @type {() => void} */ (cleanup);
			});
		}
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		if (component_context === null) {
			lifecycle_outside_component();
		}

		onMount(() => () => untrack(fn));
	}

	/**
	 * Legacy-mode: Init callbacks object for onMount/beforeUpdate/afterUpdate
	 * @param {ComponentContext} context
	 */
	function init_update_callbacks(context) {
		var l = /** @type {ComponentContextLegacy} */ (context).l;
		return (l.u ??= { a: [], b: [], m: [] });
	}

	/** @import { TemplateNode } from '#client' */

	/**
	 * @param {TemplateNode} node
	 * @param {(branch: (fn: (anchor: Node) => void, key?: number | false) => void) => void} fn
	 * @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
	 * @returns {void}
	 */
	function if_block(node, fn, elseif = false) {

		var branches = new BranchManager(node);
		var flags = elseif ? EFFECT_TRANSPARENT : 0;

		/**
		 * @param {number | false} key
		 * @param {null | ((anchor: Node) => void)} fn
		 */
		function update_branch(key, fn) {

			branches.ensure(key, fn);
		}

		block(() => {
			var has_branch = false;

			fn((fn, key = 0) => {
				has_branch = true;
				update_branch(key, fn);
			});

			if (!has_branch) {
				update_branch(false, null);
			}
		}, flags);
	}

	/** @import { EachItem, EachOutroGroup, EachState, Effect, EffectNodes, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */
	/** @import { Batch } from '../../reactivity/batch.js'; */

	/**
	 * Pause multiple effects simultaneously, and coordinate their
	 * subsequent destruction. Used in each blocks
	 * @param {EachState} state
	 * @param {Effect[]} to_destroy
	 * @param {null | Node} controlled_anchor
	 */
	function pause_effects(state, to_destroy, controlled_anchor) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		var length = to_destroy.length;

		/** @type {EachOutroGroup} */
		var group;
		var remaining = to_destroy.length;

		for (var i = 0; i < length; i++) {
			let effect = to_destroy[i];

			pause_effect(
				effect,
				() => {
					if (group) {
						group.pending.delete(effect);
						group.done.add(effect);

						if (group.pending.size === 0) {
							var groups = /** @type {Set<EachOutroGroup>} */ (state.outrogroups);

							destroy_effects(array_from(group.done));
							groups.delete(group);

							if (groups.size === 0) {
								state.outrogroups = null;
							}
						}
					} else {
						remaining -= 1;
					}
				},
				false
			);
		}

		if (remaining === 0) {
			// If we're in a controlled each block (i.e. the block is the only child of an
			// element), and we are removing all items, _and_ there are no out transitions,
			// we can use the fast path — emptying the element and replacing the anchor
			var fast_path = transitions.length === 0 && controlled_anchor !== null;

			if (fast_path) {
				var anchor = /** @type {Element} */ (controlled_anchor);
				var parent_node = /** @type {Element} */ (anchor.parentNode);

				clear_text_content(parent_node);
				parent_node.append(anchor);

				state.items.clear();
			}

			destroy_effects(to_destroy, !fast_path);
		} else {
			group = {
				pending: new Set(to_destroy),
				done: new Set()
			};

			(state.outrogroups ??= new Set()).add(group);
		}
	}

	/**
	 * @param {Effect[]} to_destroy
	 * @param {boolean} remove_dom
	 */
	function destroy_effects(to_destroy, remove_dom = true) {
		// TODO only destroy effects if no pending batch needs them. otherwise,
		// just re-add the `EFFECT_OFFSCREEN` flag
		for (var i = 0; i < to_destroy.length; i++) {
			destroy_effect(to_destroy[i], remove_dom);
		}
	}

	/** @type {TemplateNode} */
	var offscreen_anchor;

	/**
	 * @template V
	 * @param {Element | Comment} node The next sibling node, or the parent node if this is a 'controlled' block
	 * @param {number} flags
	 * @param {() => V[]} get_collection
	 * @param {(value: V, index: number) => any} get_key
	 * @param {(anchor: Node, item: MaybeSource<V>, index: MaybeSource<number>) => void} render_fn
	 * @param {null | ((anchor: Node) => void)} fallback_fn
	 * @returns {void}
	 */
	function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
		var anchor = node;

		/** @type {Map<any, EachItem>} */
		var items = new Map();

		var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;

		if (is_controlled) {
			var parent_node = /** @type {Element} */ (node);

			anchor = parent_node.appendChild(create_text());
		}

		/** @type {Effect | null} */
		var fallback = null;

		// TODO: ideally we could use derived for runes mode but because of the ability
		// to use a store which can be mutated, we can't do that here as mutating a store
		// will still result in the collection array being the same from the store
		var each_array = derived_safe_equal(() => {
			var collection = get_collection();

			return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
		});

		/** @type {V[]} */
		var array;

		var first_run = true;

		function commit() {
			state.fallback = fallback;
			reconcile(state, array, anchor, flags, get_key);

			if (fallback !== null) {
				if (array.length === 0) {
					if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
						resume_effect(fallback);
					} else {
						fallback.f ^= EFFECT_OFFSCREEN;
						move(fallback, null, anchor);
					}
				} else {
					pause_effect(fallback, () => {
						// TODO only null out if no pending batch needs it,
						// otherwise re-add `fallback.fragment` and move the
						// effect into it
						fallback = null;
					});
				}
			}
		}

		var effect = block(() => {
			array = /** @type {V[]} */ (get$2(each_array));
			var length = array.length;

			var keys = new Set();
			var batch = /** @type {Batch} */ (current_batch);
			var defer = should_defer_append();

			for (var index = 0; index < length; index += 1) {

				var value = array[index];
				var key = get_key(value, index);

				var item = first_run ? null : items.get(key);

				if (item) {
					// update before reconciliation, to trigger any async updates
					if (item.v) internal_set(item.v, value);
					if (item.i) internal_set(item.i, index);

					if (defer) {
						batch.unskip_effect(item.e);
					}
				} else {
					item = create_item(
						items,
						first_run ? anchor : (offscreen_anchor ??= create_text()),
						value,
						key,
						index,
						render_fn,
						flags,
						get_collection
					);

					if (!first_run) {
						item.e.f |= EFFECT_OFFSCREEN;
					}

					items.set(key, item);
				}

				keys.add(key);
			}

			if (length === 0 && fallback_fn && !fallback) {
				if (first_run) {
					fallback = branch(() => fallback_fn(anchor));
				} else {
					fallback = branch(() => fallback_fn((offscreen_anchor ??= create_text())));
					fallback.f |= EFFECT_OFFSCREEN;
				}
			}

			if (length > keys.size) {
				{
					// in prod, the additional information isn't printed, so don't bother computing it
					each_key_duplicate();
				}
			}

			if (!first_run) {
				if (defer) {
					for (const [key, item] of items) {
						if (!keys.has(key)) {
							batch.skip_effect(item.e);
						}
					}

					batch.oncommit(commit);
					batch.ondiscard(() => {
						// TODO presumably we need to do something here?
					});
				} else {
					commit();
				}
			}

			// When we mount the each block for the first time, the collection won't be
			// connected to this effect as the effect hasn't finished running yet and its deps
			// won't be assigned. However, it's possible that when reconciling the each block
			// that a mutation occurred and it's made the collection MAYBE_DIRTY, so reading the
			// collection again can provide consistency to the reactive graph again as the deriveds
			// will now be `CLEAN`.
			get$2(each_array);
		});

		/** @type {EachState} */
		var state = { effect, items, outrogroups: null, fallback };

		first_run = false;
	}

	/**
	 * Skip past any non-branch effects (which could be created with `createSubscriber`, for example) to find the next branch effect
	 * @param {Effect | null} effect
	 * @returns {Effect | null}
	 */
	function skip_to_branch(effect) {
		while (effect !== null && (effect.f & BRANCH_EFFECT) === 0) {
			effect = effect.next;
		}
		return effect;
	}

	/**
	 * Add, remove, or reorder items output by an each block as its input changes
	 * @template V
	 * @param {EachState} state
	 * @param {Array<V>} array
	 * @param {Element | Comment | Text} anchor
	 * @param {number} flags
	 * @param {(value: V, index: number) => any} get_key
	 * @returns {void}
	 */
	function reconcile(state, array, anchor, flags, get_key) {
		var is_animated = (flags & EACH_IS_ANIMATED) !== 0;

		var length = array.length;
		var items = state.items;
		var current = skip_to_branch(state.effect.first);

		/** @type {undefined | Set<Effect>} */
		var seen;

		/** @type {Effect | null} */
		var prev = null;

		/** @type {undefined | Set<Effect>} */
		var to_animate;

		/** @type {Effect[]} */
		var matched = [];

		/** @type {Effect[]} */
		var stashed = [];

		/** @type {V} */
		var value;

		/** @type {any} */
		var key;

		/** @type {Effect | undefined} */
		var effect;

		/** @type {number} */
		var i;

		if (is_animated) {
			for (i = 0; i < length; i += 1) {
				value = array[i];
				key = get_key(value, i);
				effect = /** @type {EachItem} */ (items.get(key)).e;

				// offscreen == coming in now, no animation in that case,
				// else this would happen https://github.com/sveltejs/svelte/issues/17181
				if ((effect.f & EFFECT_OFFSCREEN) === 0) {
					effect.nodes?.a?.measure();
					(to_animate ??= new Set()).add(effect);
				}
			}
		}

		for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);

			effect = /** @type {EachItem} */ (items.get(key)).e;

			if (state.outrogroups !== null) {
				for (const group of state.outrogroups) {
					group.pending.delete(effect);
					group.done.delete(effect);
				}
			}

			if ((effect.f & EFFECT_OFFSCREEN) !== 0) {
				effect.f ^= EFFECT_OFFSCREEN;

				if (effect === current) {
					move(effect, null, anchor);
				} else {
					var next = prev ? prev.next : current;

					if (effect === state.effect.last) {
						state.effect.last = effect.prev;
					}

					if (effect.prev) effect.prev.next = effect.next;
					if (effect.next) effect.next.prev = effect.prev;
					link(state, prev, effect);
					link(state, effect, next);

					move(effect, next, anchor);
					prev = effect;

					matched = [];
					stashed = [];

					current = skip_to_branch(prev.next);
					continue;
				}
			}

			if ((effect.f & INERT) !== 0) {
				resume_effect(effect);
				if (is_animated) {
					effect.nodes?.a?.unfix();
					(to_animate ??= new Set()).delete(effect);
				}
			}

			if (effect !== current) {
				if (seen !== undefined && seen.has(effect)) {
					if (matched.length < stashed.length) {
						// more efficient to move later items to the front
						var start = stashed[0];
						var j;

						prev = start.prev;

						var a = matched[0];
						var b = matched[matched.length - 1];

						for (j = 0; j < matched.length; j += 1) {
							move(matched[j], start, anchor);
						}

						for (j = 0; j < stashed.length; j += 1) {
							seen.delete(stashed[j]);
						}

						link(state, a.prev, b.next);
						link(state, prev, a);
						link(state, b, start);

						current = start;
						prev = b;
						i -= 1;

						matched = [];
						stashed = [];
					} else {
						// more efficient to move earlier items to the back
						seen.delete(effect);
						move(effect, current, anchor);

						link(state, effect.prev, effect.next);
						link(state, effect, prev === null ? state.effect.first : prev.next);
						link(state, prev, effect);

						prev = effect;
					}

					continue;
				}

				matched = [];
				stashed = [];

				while (current !== null && current !== effect) {
					(seen ??= new Set()).add(current);
					stashed.push(current);
					current = skip_to_branch(current.next);
				}

				if (current === null) {
					continue;
				}
			}

			if ((effect.f & EFFECT_OFFSCREEN) === 0) {
				matched.push(effect);
			}

			prev = effect;
			current = skip_to_branch(effect.next);
		}

		if (state.outrogroups !== null) {
			for (const group of state.outrogroups) {
				if (group.pending.size === 0) {
					destroy_effects(array_from(group.done));
					state.outrogroups?.delete(group);
				}
			}

			if (state.outrogroups.size === 0) {
				state.outrogroups = null;
			}
		}

		if (current !== null || seen !== undefined) {
			/** @type {Effect[]} */
			var to_destroy = [];

			if (seen !== undefined) {
				for (effect of seen) {
					if ((effect.f & INERT) === 0) {
						to_destroy.push(effect);
					}
				}
			}

			while (current !== null) {
				// If the each block isn't inert, then inert effects are currently outroing and will be removed once the transition is finished
				if ((current.f & INERT) === 0 && current !== state.fallback) {
					to_destroy.push(current);
				}

				current = skip_to_branch(current.next);
			}

			var destroy_length = to_destroy.length;

			if (destroy_length > 0) {
				var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;

				if (is_animated) {
					for (i = 0; i < destroy_length; i += 1) {
						to_destroy[i].nodes?.a?.measure();
					}

					for (i = 0; i < destroy_length; i += 1) {
						to_destroy[i].nodes?.a?.fix();
					}
				}

				pause_effects(state, to_destroy, controlled_anchor);
			}
		}

		if (is_animated) {
			queue_micro_task(() => {
				if (to_animate === undefined) return;
				for (effect of to_animate) {
					effect.nodes?.a?.apply();
				}
			});
		}
	}

	/**
	 * @template V
	 * @param {Map<any, EachItem>} items
	 * @param {Node} anchor
	 * @param {V} value
	 * @param {unknown} key
	 * @param {number} index
	 * @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>, collection: () => V[]) => void} render_fn
	 * @param {number} flags
	 * @param {() => V[]} get_collection
	 * @returns {EachItem}
	 */
	function create_item(items, anchor, value, key, index, render_fn, flags, get_collection) {
		var v =
			(flags & EACH_ITEM_REACTIVE) !== 0
				? (flags & EACH_ITEM_IMMUTABLE) === 0
					? mutable_source(value, false, false)
					: source(value)
				: null;

		var i = (flags & EACH_INDEX_REACTIVE) !== 0 ? source(index) : null;

		return {
			v,
			i,
			e: branch(() => {
				render_fn(anchor, v ?? value, i ?? index, get_collection);

				return () => {
					items.delete(key);
				};
			})
		};
	}

	/**
	 * @param {Effect} effect
	 * @param {Effect | null} next
	 * @param {Text | Element | Comment} anchor
	 */
	function move(effect, next, anchor) {
		if (!effect.nodes) return;

		var node = effect.nodes.start;
		var end = effect.nodes.end;

		var dest =
			next && (next.f & EFFECT_OFFSCREEN) === 0
				? /** @type {EffectNodes} */ (next.nodes).start
				: anchor;

		while (node !== null) {
			var next_node = /** @type {TemplateNode} */ (get_next_sibling(node));
			dest.before(node);

			if (node === end) {
				return;
			}

			node = next_node;
		}
	}

	/**
	 * @param {EachState} state
	 * @param {Effect | null} prev
	 * @param {Effect | null} next
	 */
	function link(state, prev, next) {
		if (prev === null) {
			state.effect.first = next;
		} else {
			prev.next = next;
		}

		if (next === null) {
			state.effect.last = prev;
		} else {
			next.prev = prev;
		}
	}

	/** @import { TemplateNode, Dom } from '#client' */

	/**
	 * @template P
	 * @template {(props: P) => void} C
	 * @param {TemplateNode} node
	 * @param {() => C} get_component
	 * @param {(anchor: TemplateNode, component: C) => Dom | void} render_fn
	 * @returns {void}
	 */
	function component(node, get_component, render_fn) {

		var branches = new BranchManager(node);

		block(() => {
			var component = get_component() ?? null;
			branches.ensure(component, component && ((target) => render_fn(target, component)));
		}, EFFECT_TRANSPARENT);
	}

	/** @import { ActionPayload } from '#client' */

	/**
	 * @template P
	 * @param {Element} dom
	 * @param {(dom: Element, value?: P) => ActionPayload<P>} action
	 * @param {() => P} [get_value]
	 * @returns {void}
	 */
	function action(dom, action, get_value) {
		effect(() => {
			var payload = untrack(() => action(dom, get_value?.()) || {});

			if (get_value && payload?.update) {
				var inited = false;
				/** @type {P} */
				var prev = /** @type {any} */ ({}); // initialize with something so it's never equal on first run

				render_effect(() => {
					var value = get_value();

					// Action's update method is coarse-grained, i.e. when anything in the passed value changes, update.
					// This works in legacy mode because of mutable_source being updated as a whole, but when using $state
					// together with actions and mutation, it wouldn't notice the change without a deep read.
					deep_read_state(value);

					if (inited && safe_not_equal(prev, value)) {
						prev = value;
						/** @type {Function} */ (payload.update)(value);
					}
				});

				inited = true;
			}

			if (payload?.destroy) {
				return () => /** @type {Function} */ (payload.destroy)();
			}
		});
	}

	/** @import { Effect } from '#client' */

	// TODO in 6.0 or 7.0, when we remove legacy mode, we can simplify this by
	// getting rid of the block/branch stuff and just letting the effect rip.
	// see https://github.com/sveltejs/svelte/pull/15962

	/**
	 * @param {Element} node
	 * @param {() => (node: Element) => void} get_fn
	 */
	function attach(node, get_fn) {
		/** @type {false | undefined | ((node: Element) => void)} */
		var fn = undefined;

		/** @type {Effect | null} */
		var e;

		managed(() => {
			if (fn !== (fn = get_fn())) {
				if (e) {
					destroy_effect(e);
					e = null;
				}

				if (fn) {
					e = branch(() => {
						effect(() => /** @type {(node: Element) => void} */ (fn)(node));
					});
				}
			}
		});
	}

	function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx$1(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

	/**
	 * Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
	 * TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
	 * @param  {any} value
	 */
	function clsx(value) {
		if (typeof value === 'object') {
			return clsx$1(value);
		} else {
			return value ?? '';
		}
	}

	const whitespace = [...' \t\n\r\f\u00a0\u000b\ufeff'];

	/**
	 * @param {any} value
	 * @param {string | null} [hash]
	 * @param {Record<string, boolean>} [directives]
	 * @returns {string | null}
	 */
	function to_class(value, hash, directives) {
		var classname = value == null ? '' : '' + value;

		if (hash) {
			classname = classname ? classname + ' ' + hash : hash;
		}

		if (directives) {
			for (var key in directives) {
				if (directives[key]) {
					classname = classname ? classname + ' ' + key : key;
				} else if (classname.length) {
					var len = key.length;
					var a = 0;

					while ((a = classname.indexOf(key, a)) >= 0) {
						var b = a + len;

						if (
							(a === 0 || whitespace.includes(classname[a - 1])) &&
							(b === classname.length || whitespace.includes(classname[b]))
						) {
							classname = (a === 0 ? '' : classname.substring(0, a)) + classname.substring(b + 1);
						} else {
							a = b;
						}
					}
				}
			}
		}

		return classname === '' ? null : classname;
	}

	/**
	 *
	 * @param {Record<string,any>} styles
	 * @param {boolean} important
	 */
	function append_styles(styles, important = false) {
		var separator = important ? ' !important;' : ';';
		var css = '';

		for (var key in styles) {
			var value = styles[key];
			if (value != null && value !== '') {
				css += ' ' + key + ': ' + value + separator;
			}
		}

		return css;
	}

	/**
	 * @param {string} name
	 * @returns {string}
	 */
	function to_css_name(name) {
		if (name[0] !== '-' || name[1] !== '-') {
			return name.toLowerCase();
		}
		return name;
	}

	/**
	 * @param {any} value
	 * @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
	 * @returns {string | null}
	 */
	function to_style(value, styles) {
		if (styles) {
			var new_style = '';

			/** @type {Record<string,any> | undefined} */
			var normal_styles;

			/** @type {Record<string,any> | undefined} */
			var important_styles;

			if (Array.isArray(styles)) {
				normal_styles = styles[0];
				important_styles = styles[1];
			} else {
				normal_styles = styles;
			}

			if (value) {
				value = String(value)
					.replaceAll(/\s*\/\*.*?\*\/\s*/g, '')
					.trim();

				/** @type {boolean | '"' | "'"} */
				var in_str = false;
				var in_apo = 0;
				var in_comment = false;

				var reserved_names = [];

				if (normal_styles) {
					reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
				}
				if (important_styles) {
					reserved_names.push(...Object.keys(important_styles).map(to_css_name));
				}

				var start_index = 0;
				var name_index = -1;

				const len = value.length;
				for (var i = 0; i < len; i++) {
					var c = value[i];

					if (in_comment) {
						if (c === '/' && value[i - 1] === '*') {
							in_comment = false;
						}
					} else if (in_str) {
						if (in_str === c) {
							in_str = false;
						}
					} else if (c === '/' && value[i + 1] === '*') {
						in_comment = true;
					} else if (c === '"' || c === "'") {
						in_str = c;
					} else if (c === '(') {
						in_apo++;
					} else if (c === ')') {
						in_apo--;
					}

					if (!in_comment && in_str === false && in_apo === 0) {
						if (c === ':' && name_index === -1) {
							name_index = i;
						} else if (c === ';' || i === len - 1) {
							if (name_index !== -1) {
								var name = to_css_name(value.substring(start_index, name_index).trim());

								if (!reserved_names.includes(name)) {
									if (c !== ';') {
										i++;
									}

									var property = value.substring(start_index, i).trim();
									new_style += ' ' + property + ';';
								}
							}

							start_index = i + 1;
							name_index = -1;
						}
					}
				}
			}

			if (normal_styles) {
				new_style += append_styles(normal_styles);
			}

			if (important_styles) {
				new_style += append_styles(important_styles, true);
			}

			new_style = new_style.trim();
			return new_style === '' ? null : new_style;
		}

		return value == null ? null : String(value);
	}

	/**
	 * @param {Element} dom
	 * @param {boolean | number} is_html
	 * @param {string | null} value
	 * @param {string} [hash]
	 * @param {Record<string, any>} [prev_classes]
	 * @param {Record<string, any>} [next_classes]
	 * @returns {Record<string, boolean> | undefined}
	 */
	function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
		// @ts-expect-error need to add __className to patched prototype
		var prev = dom.__className;

		if (
			prev !== value ||
			prev === undefined // for edge case of `class={undefined}`
		) {
			var next_class_name = to_class(value, hash, next_classes);

			{
				// Removing the attribute when the value is only an empty string causes
				// performance issues vs simply making the className an empty string. So
				// we should only remove the class if the value is nullish
				// and there no hash/directives :
				if (next_class_name == null) {
					dom.removeAttribute('class');
				} else if (is_html) {
					dom.className = next_class_name;
				} else {
					dom.setAttribute('class', next_class_name);
				}
			}

			// @ts-expect-error need to add __className to patched prototype
			dom.__className = value;
		} else if (next_classes && prev_classes !== next_classes) {
			for (var key in next_classes) {
				var is_present = !!next_classes[key];

				if (prev_classes == null || is_present !== !!prev_classes[key]) {
					dom.classList.toggle(key, is_present);
				}
			}
		}

		return next_classes;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} dom
	 * @param {Record<string, any>} prev
	 * @param {Record<string, any>} next
	 * @param {string} [priority]
	 */
	function update_styles(dom, prev = {}, next, priority) {
		for (var key in next) {
			var value = next[key];

			if (prev[key] !== value) {
				if (next[key] == null) {
					dom.style.removeProperty(key);
				} else {
					dom.style.setProperty(key, value, priority);
				}
			}
		}
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} dom
	 * @param {string | null} value
	 * @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [prev_styles]
	 * @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [next_styles]
	 */
	function set_style(dom, value, prev_styles, next_styles) {
		// @ts-expect-error
		var prev = dom.__style;

		if (prev !== value) {
			var next_style_attr = to_style(value, next_styles);

			{
				if (next_style_attr == null) {
					dom.removeAttribute('style');
				} else {
					dom.style.cssText = next_style_attr;
				}
			}

			// @ts-expect-error
			dom.__style = value;
		} else if (next_styles) {
			if (Array.isArray(next_styles)) {
				update_styles(dom, prev_styles?.[0], next_styles[0]);
				update_styles(dom, prev_styles?.[1], next_styles[1], 'important');
			} else {
				update_styles(dom, prev_styles, next_styles);
			}
		}

		return next_styles;
	}

	/**
	 * Selects the correct option(s) (depending on whether this is a multiple select)
	 * @template V
	 * @param {HTMLSelectElement} select
	 * @param {V} value
	 * @param {boolean} mounting
	 */
	function select_option(select, value, mounting = false) {
		if (select.multiple) {
			// If value is null or undefined, keep the selection as is
			if (value == undefined) {
				return;
			}

			// If not an array, warn and keep the selection as is
			if (!is_array(value)) {
				return select_multiple_invalid_value();
			}

			// Otherwise, update the selection
			for (var option of select.options) {
				option.selected = value.includes(get_option_value(option));
			}

			return;
		}

		for (option of select.options) {
			var option_value = get_option_value(option);
			if (is(option_value, value)) {
				option.selected = true;
				return;
			}
		}

		if (!mounting || value !== undefined) {
			select.selectedIndex = -1; // no option should be selected
		}
	}

	/**
	 * Selects the correct option(s) if `value` is given,
	 * and then sets up a mutation observer to sync the
	 * current selection to the dom when it changes. Such
	 * changes could for example occur when options are
	 * inside an `#each` block.
	 * @param {HTMLSelectElement} select
	 */
	function init_select(select) {
		var observer = new MutationObserver(() => {
			// @ts-ignore
			select_option(select, select.__value);
			// Deliberately don't update the potential binding value,
			// the model should be preserved unless explicitly changed
		});

		observer.observe(select, {
			// Listen to option element changes
			childList: true,
			subtree: true, // because of <optgroup>
			// Listen to option element value attribute changes
			// (doesn't get notified of select value changes,
			// because that property is not reflected as an attribute)
			attributes: true,
			attributeFilter: ['value']
		});

		teardown(() => {
			observer.disconnect();
		});
	}

	/** @param {HTMLOptionElement} option */
	function get_option_value(option) {
		// __value only exists if the <option> has a value attribute
		if ('__value' in option) {
			return option.__value;
		} else {
			return option.value;
		}
	}

	/** @import { Blocker, Effect } from '#client' */

	const CLASS = Symbol('class');
	const STYLE = Symbol('style');

	const IS_CUSTOM_ELEMENT = Symbol('is custom element');
	const IS_HTML = Symbol('is html');
	const OPTION_TAG = IS_XHTML ? 'option' : 'OPTION';
	const SELECT_TAG = IS_XHTML ? 'select' : 'SELECT';

	/**
	 * Sets the `selected` attribute on an `option` element.
	 * Not set through the property because that doesn't reflect to the DOM,
	 * which means it wouldn't be taken into account when a form is reset.
	 * @param {HTMLOptionElement} element
	 * @param {boolean} selected
	 */
	function set_selected(element, selected) {
		if (selected) {
			// The selected option could've changed via user selection, and
			// setting the value without this check would set it back.
			if (!element.hasAttribute('selected')) {
				element.setAttribute('selected', '');
			}
		} else {
			element.removeAttribute('selected');
		}
	}

	/**
	 * @param {Element} element
	 * @param {string} attribute
	 * @param {string | null} value
	 * @param {boolean} [skip_warning]
	 */
	function set_attribute(element, attribute, value, skip_warning) {
		var attributes = get_attributes(element);

		if (attributes[attribute] === (attributes[attribute] = value)) return;

		if (attribute === 'loading') {
			// @ts-expect-error
			element[LOADING_ATTR_SYMBOL] = value;
		}

		if (value == null) {
			element.removeAttribute(attribute);
		} else if (typeof value !== 'string' && get_setters(element).includes(attribute)) {
			// @ts-ignore
			element[attribute] = value;
		} else {
			element.setAttribute(attribute, value);
		}
	}

	/**
	 * Spreads attributes onto a DOM element, taking into account the currently set attributes
	 * @param {Element & ElementCSSInlineStyle} element
	 * @param {Record<string | symbol, any> | undefined} prev
	 * @param {Record<string | symbol, any>} next New attributes - this function mutates this object
	 * @param {string} [css_hash]
	 * @param {boolean} [should_remove_defaults]
	 * @param {boolean} [skip_warning]
	 * @returns {Record<string, any>}
	 */
	function set_attributes(
		element,
		prev,
		next,
		css_hash,
		should_remove_defaults = false,
		skip_warning = false
	) {

		var attributes = get_attributes(element);

		var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
		var preserve_attribute_case = !attributes[IS_HTML];

		var current = prev || {};
		var is_option_element = element.nodeName === OPTION_TAG;

		for (var key in prev) {
			if (!(key in next)) {
				next[key] = null;
			}
		}

		if (next.class) {
			next.class = clsx(next.class);
		} else if (css_hash || next[CLASS]) {
			next.class = null; /* force call to set_class() */
		}

		if (next[STYLE]) {
			next.style ??= null; /* force call to set_style() */
		}

		var setters = get_setters(element);

		// since key is captured we use const
		for (const key in next) {
			// let instead of var because referenced in a closure
			let value = next[key];

			// Up here because we want to do this for the initial value, too, even if it's undefined,
			// and this wouldn't be reached in case of undefined because of the equality check below
			if (is_option_element && key === 'value' && value == null) {
				// The <option> element is a special case because removing the value attribute means
				// the value is set to the text content of the option element, and setting the value
				// to null or undefined means the value is set to the string "null" or "undefined".
				// To align with how we handle this case in non-spread-scenarios, this logic is needed.
				// There's a super-edge-case bug here that is left in in favor of smaller code size:
				// Because of the "set missing props to null" logic above, we can't differentiate
				// between a missing value and an explicitly set value of null or undefined. That means
				// that once set, the value attribute of an <option> element can't be removed. This is
				// a very rare edge case, and removing the attribute altogether isn't possible either
				// for the <option value={undefined}> case, so we're not losing any functionality here.
				// @ts-ignore
				element.value = element.__value = '';
				current[key] = value;
				continue;
			}

			if (key === 'class') {
				var is_html = element.namespaceURI === 'http://www.w3.org/1999/xhtml';
				set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
				current[key] = value;
				current[CLASS] = next[CLASS];
				continue;
			}

			if (key === 'style') {
				set_style(element, value, prev?.[STYLE], next[STYLE]);
				current[key] = value;
				current[STYLE] = next[STYLE];
				continue;
			}

			var prev_value = current[key];

			// Skip if value is unchanged, unless it's `undefined` and the element still has the attribute
			if (value === prev_value && !(value === undefined && element.hasAttribute(key))) {
				continue;
			}

			current[key] = value;

			var prefix = key[0] + key[1]; // this is faster than key.slice(0, 2)
			if (prefix === '$$') continue;

			if (prefix === 'on') {
				/** @type {{ capture?: true }} */
				const opts = {};
				const event_handle_key = '$$' + key;
				let event_name = key.slice(2);
				var delegated = can_delegate_event(event_name);

				if (is_capture_event(event_name)) {
					event_name = event_name.slice(0, -7);
					opts.capture = true;
				}

				if (!delegated && prev_value) {
					// Listening to same event but different handler -> our handle function below takes care of this
					// If we were to remove and add listeners in this case, it could happen that the event is "swallowed"
					// (the browser seems to not know yet that a new one exists now) and doesn't reach the handler
					// https://github.com/sveltejs/svelte/issues/11903
					if (value != null) continue;

					element.removeEventListener(event_name, current[event_handle_key], opts);
					current[event_handle_key] = null;
				}

				if (value != null) {
					if (!delegated) {
						/**
						 * @this {any}
						 * @param {Event} evt
						 */
						function handle(evt) {
							current[key].call(this, evt);
						}

						current[event_handle_key] = create_event(event_name, element, handle, opts);
					} else {
						// @ts-ignore
						element[`__${event_name}`] = value;
						delegate([event_name]);
					}
				} else if (delegated) {
					// @ts-ignore
					element[`__${event_name}`] = undefined;
				}
			} else if (key === 'style') {
				// avoid using the setter
				set_attribute(element, key, value);
			} else if (key === 'autofocus') {
				autofocus(/** @type {HTMLElement} */ (element), Boolean(value));
			} else if (!is_custom_element && (key === '__value' || (key === 'value' && value != null))) {
				// @ts-ignore We're not running this for custom elements because __value is actually
				// how Lit stores the current value on the element, and messing with that would break things.
				element.value = element.__value = value;
			} else if (key === 'selected' && is_option_element) {
				set_selected(/** @type {HTMLOptionElement} */ (element), value);
			} else {
				var name = key;
				if (!preserve_attribute_case) {
					name = normalize_attribute(name);
				}

				var is_default = name === 'defaultValue' || name === 'defaultChecked';

				if (value == null && !is_custom_element && !is_default) {
					attributes[key] = null;

					if (name === 'value' || name === 'checked') {
						// removing value/checked also removes defaultValue/defaultChecked — preserve
						let input = /** @type {HTMLInputElement} */ (element);
						const use_default = prev === undefined;
						if (name === 'value') {
							let previous = input.defaultValue;
							input.removeAttribute(name);
							input.defaultValue = previous;
							// @ts-ignore
							input.value = input.__value = use_default ? previous : null;
						} else {
							let previous = input.defaultChecked;
							input.removeAttribute(name);
							input.defaultChecked = previous;
							input.checked = use_default ? previous : false;
						}
					} else {
						element.removeAttribute(key);
					}
				} else if (
					is_default ||
					(setters.includes(name) && (is_custom_element || typeof value !== 'string'))
				) {
					// @ts-ignore
					element[name] = value;
					// remove it from attributes's cache
					if (name in attributes) attributes[name] = UNINITIALIZED;
				} else if (typeof value !== 'function') {
					set_attribute(element, name, value);
				}
			}
		}

		return current;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} element
	 * @param {(...expressions: any) => Record<string | symbol, any>} fn
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {Blocker[]} blockers
	 * @param {string} [css_hash]
	 * @param {boolean} [should_remove_defaults]
	 * @param {boolean} [skip_warning]
	 */
	function attribute_effect(
		element,
		fn,
		sync = [],
		async = [],
		blockers = [],
		css_hash,
		should_remove_defaults = false,
		skip_warning = false
	) {
		flatten(blockers, sync, async, (values) => {
			/** @type {Record<string | symbol, any> | undefined} */
			var prev = undefined;

			/** @type {Record<symbol, Effect>} */
			var effects = {};

			var is_select = element.nodeName === SELECT_TAG;
			var inited = false;

			managed(() => {
				var next = fn(...values.map(get$2));
				/** @type {Record<string | symbol, any>} */
				var current = set_attributes(
					element,
					prev,
					next,
					css_hash,
					should_remove_defaults,
					skip_warning
				);

				if (inited && is_select && 'value' in next) {
					select_option(/** @type {HTMLSelectElement} */ (element), next.value);
				}

				for (let symbol of Object.getOwnPropertySymbols(effects)) {
					if (!next[symbol]) destroy_effect(effects[symbol]);
				}

				for (let symbol of Object.getOwnPropertySymbols(next)) {
					var n = next[symbol];

					if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
						if (effects[symbol]) destroy_effect(effects[symbol]);
						effects[symbol] = branch(() => attach(element, () => n));
					}

					current[symbol] = n;
				}

				prev = current;
			});

			if (is_select) {
				var select = /** @type {HTMLSelectElement} */ (element);

				effect(() => {
					select_option(select, /** @type {Record<string | symbol, any>} */ (prev).value, true);
					init_select(select);
				});
			}

			inited = true;
		});
	}

	/**
	 *
	 * @param {Element} element
	 */
	function get_attributes(element) {
		return /** @type {Record<string | symbol, unknown>} **/ (
			// @ts-expect-error
			element.__attributes ??= {
				[IS_CUSTOM_ELEMENT]: element.nodeName.includes('-'),
				[IS_HTML]: element.namespaceURI === NAMESPACE_HTML
			}
		);
	}

	/** @type {Map<string, string[]>} */
	var setters_cache = new Map();

	/** @param {Element} element */
	function get_setters(element) {
		var cache_key = element.getAttribute('is') || element.nodeName;
		var setters = setters_cache.get(cache_key);
		if (setters) return setters;
		setters_cache.set(cache_key, (setters = []));

		var descriptors;
		var proto = element; // In the case of custom elements there might be setters on the instance
		var element_proto = Element.prototype;

		// Stop at Element, from there on there's only unnecessary setters we're not interested in
		// Do not use contructor.name here as that's unreliable in some browser environments
		while (element_proto !== proto) {
			descriptors = get_descriptors(proto);

			for (var key in descriptors) {
				if (descriptors[key].set) {
					setters.push(key);
				}
			}

			proto = get_prototype_of(proto);
		}

		return setters;
	}

	/**
	 * We create one listener for all elements
	 * @see {@link https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ Explanation}
	 */
	class ResizeObserverSingleton {
		/** */
		#listeners = new WeakMap();

		/** @type {ResizeObserver | undefined} */
		#observer;

		/** @type {ResizeObserverOptions} */
		#options;

		/** @static */
		static entries = new WeakMap();

		/** @param {ResizeObserverOptions} options */
		constructor(options) {
			this.#options = options;
		}

		/**
		 * @param {Element} element
		 * @param {(entry: ResizeObserverEntry) => any} listener
		 */
		observe(element, listener) {
			var listeners = this.#listeners.get(element) || new Set();
			listeners.add(listener);

			this.#listeners.set(element, listeners);
			this.#getObserver().observe(element, this.#options);

			return () => {
				var listeners = this.#listeners.get(element);
				listeners.delete(listener);

				if (listeners.size === 0) {
					this.#listeners.delete(element);
					/** @type {ResizeObserver} */ (this.#observer).unobserve(element);
				}
			};
		}

		#getObserver() {
			return (
				this.#observer ??
				(this.#observer = new ResizeObserver(
					/** @param {any} entries */ (entries) => {
						for (var entry of entries) {
							ResizeObserverSingleton.entries.set(entry.target, entry);
							for (var listener of this.#listeners.get(entry.target) || []) {
								listener(entry);
							}
						}
					}
				))
			);
		}
	}

	var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
		box: 'border-box'
	});

	/**
	 * @param {HTMLElement} element
	 * @param {'clientWidth' | 'clientHeight' | 'offsetWidth' | 'offsetHeight'} type
	 * @param {(size: number) => void} set
	 */
	function bind_element_size(element, type, set) {
		var unsub = resize_observer_border_box.observe(element, () => set(element[type]));

		effect(() => {
			// The update could contain reads which should be ignored
			untrack(() => set(element[type]));
			return unsub;
		});
	}

	/**
	 * @param {any} bound_value
	 * @param {Element} element_or_component
	 * @returns {boolean}
	 */
	function is_bound_this(bound_value, element_or_component) {
		return (
			bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component
		);
	}

	/**
	 * @param {any} element_or_component
	 * @param {(value: unknown, ...parts: unknown[]) => void} update
	 * @param {(...parts: unknown[]) => unknown} get_value
	 * @param {() => unknown[]} [get_parts] Set if the this binding is used inside an each block,
	 * 										returns all the parts of the each block context that are used in the expression
	 * @returns {void}
	 */
	function bind_this(element_or_component = {}, update, get_value, get_parts) {
		effect(() => {
			/** @type {unknown[]} */
			var old_parts;

			/** @type {unknown[]} */
			var parts;

			render_effect(() => {
				old_parts = parts;
				// We only track changes to the parts, not the value itself to avoid unnecessary reruns.
				parts = [];

				untrack(() => {
					if (element_or_component !== get_value(...parts)) {
						update(element_or_component, ...parts);
						// If this is an effect rerun (cause: each block context changes), then nullify the binding at
						// the previous position if it isn't already taken over by a different effect.
						if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
							update(null, ...old_parts);
						}
					}
				});
			});

			return () => {
				// We cannot use effects in the teardown phase, we we use a microtask instead.
				queue_micro_task(() => {
					if (parts && is_bound_this(get_value(...parts), element_or_component)) {
						update(null, ...parts);
					}
				});
			};
		});

		return element_or_component;
	}

	/** @import { ComponentContextLegacy } from '#client' */

	/**
	 * Legacy-mode only: Call `onMount` callbacks and set up `beforeUpdate`/`afterUpdate` effects
	 * @param {boolean} [immutable]
	 */
	function init$1(immutable = false) {
		const context = /** @type {ComponentContextLegacy} */ (component_context);

		const callbacks = context.l.u;
		if (!callbacks) return;

		let props = () => deep_read_state(context.s);

		if (immutable) {
			let version = 0;
			let prev = /** @type {Record<string, any>} */ ({});

			// In legacy immutable mode, before/afterUpdate only fire if the object identity of a prop changes
			const d = derived(() => {
				let changed = false;
				const props = context.s;
				for (const key in props) {
					if (props[key] !== prev[key]) {
						prev[key] = props[key];
						changed = true;
					}
				}
				if (changed) version++;
				return version;
			});

			props = () => get$2(d);
		}

		// beforeUpdate
		if (callbacks.b.length) {
			user_pre_effect(() => {
				observe_all(context, props);
				run_all(callbacks.b);
			});
		}

		// onMount (must run before afterUpdate)
		user_effect(() => {
			const fns = untrack(() => callbacks.m.map(run));
			return () => {
				for (const fn of fns) {
					if (typeof fn === 'function') {
						fn();
					}
				}
			};
		});

		// afterUpdate
		if (callbacks.a.length) {
			user_effect(() => {
				observe_all(context, props);
				run_all(callbacks.a);
			});
		}
	}

	/**
	 * Invoke the getter of all signals associated with a component
	 * so they can be registered to the effect this function is called in.
	 * @param {ComponentContextLegacy} context
	 * @param {(() => void)} props
	 */
	function observe_all(context, props) {
		if (context.l.s) {
			for (const signal of context.l.s) get$2(signal);
		}

		props();
	}

	/** @import { StoreReferencesContainer } from '#client' */
	/** @import { Store } from '#shared' */

	/**
	 * Whether or not the prop currently being read is a store binding, as in
	 * `<Child bind:x={$y} />`. If it is, we treat the prop as mutable even in
	 * runes mode, and skip `binding_property_non_reactive` validation
	 */
	let is_store_binding = false;

	/**
	 * Returns a tuple that indicates whether `fn()` reads a prop that is a store binding.
	 * Used to prevent `binding_property_non_reactive` validation false positives and
	 * ensure that these props are treated as mutable even in runes mode
	 * @template T
	 * @param {() => T} fn
	 * @returns {[T, boolean]}
	 */
	function capture_store_binding(fn) {
		var previous_is_store_binding = is_store_binding;

		try {
			is_store_binding = false;
			return [fn(), is_store_binding];
		} finally {
			is_store_binding = previous_is_store_binding;
		}
	}

	/** @import { Effect, Source } from './types.js' */

	/**
	 * The proxy handler for rest props (i.e. `const { x, ...rest } = $props()`).
	 * Is passed the full `$$props` object and excludes the named props.
	 * @type {ProxyHandler<{ props: Record<string | symbol, unknown>, exclude: Array<string | symbol>, name?: string }>}}
	 */
	const rest_props_handler = {
		get(target, key) {
			if (target.exclude.includes(key)) return;
			return target.props[key];
		},
		set(target, key) {

			return false;
		},
		getOwnPropertyDescriptor(target, key) {
			if (target.exclude.includes(key)) return;
			if (key in target.props) {
				return {
					enumerable: true,
					configurable: true,
					value: target.props[key]
				};
			}
		},
		has(target, key) {
			if (target.exclude.includes(key)) return false;
			return key in target.props;
		},
		ownKeys(target) {
			return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
		}
	};

	/**
	 * @param {Record<string, unknown>} props
	 * @param {string[]} exclude
	 * @param {string} [name]
	 * @returns {Record<string, unknown>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function rest_props(props, exclude, name) {
		return new Proxy(
			{ props, exclude },
			rest_props_handler
		);
	}

	/**
	 * The proxy handler for spread props. Handles the incoming array of props
	 * that looks like `() => { dynamic: props }, { static: prop }, ..` and wraps
	 * them so that the whole thing is passed to the component as the `$$props` argument.
	 * @type {ProxyHandler<{ props: Array<Record<string | symbol, unknown> | (() => Record<string | symbol, unknown>)> }>}}
	 */
	const spread_props_handler = {
		get(target, key) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				if (typeof p === 'object' && p !== null && key in p) return p[key];
			}
		},
		set(target, key, value) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				const desc = get_descriptor(p, key);
				if (desc && desc.set) {
					desc.set(value);
					return true;
				}
			}
			return false;
		},
		getOwnPropertyDescriptor(target, key) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				if (typeof p === 'object' && p !== null && key in p) {
					const descriptor = get_descriptor(p, key);
					if (descriptor && !descriptor.configurable) {
						// Prevent a "Non-configurability Report Error": The target is an array, it does
						// not actually contain this property. If it is now described as non-configurable,
						// the proxy throws a validation error. Setting it to true avoids that.
						descriptor.configurable = true;
					}
					return descriptor;
				}
			}
		},
		has(target, key) {
			// To prevent a false positive `is_entry_props` in the `prop` function
			if (key === STATE_SYMBOL || key === LEGACY_PROPS) return false;

			for (let p of target.props) {
				if (is_function(p)) p = p();
				if (p != null && key in p) return true;
			}

			return false;
		},
		ownKeys(target) {
			/** @type {Array<string | symbol>} */
			const keys = [];

			for (let p of target.props) {
				if (is_function(p)) p = p();
				if (!p) continue;

				for (const key in p) {
					if (!keys.includes(key)) keys.push(key);
				}

				for (const key of Object.getOwnPropertySymbols(p)) {
					if (!keys.includes(key)) keys.push(key);
				}
			}

			return keys;
		}
	};

	/**
	 * @param {Array<Record<string, unknown> | (() => Record<string, unknown>)>} props
	 * @returns {any}
	 */
	function spread_props(...props) {
		return new Proxy({ props }, spread_props_handler);
	}

	/**
	 * This function is responsible for synchronizing a possibly bound prop with the inner component state.
	 * It is used whenever the compiler sees that the component writes to the prop, or when it has a default prop_value.
	 * @template V
	 * @param {Record<string, unknown>} props
	 * @param {string} key
	 * @param {number} flags
	 * @param {V | (() => V)} [fallback]
	 * @returns {(() => V | ((arg: V) => V) | ((arg: V, mutation: boolean) => V))}
	 */
	function prop(props, key, flags, fallback) {
		var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
		var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
		var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;

		var fallback_value = /** @type {V} */ (fallback);
		var fallback_dirty = true;

		var get_fallback = () => {
			if (fallback_dirty) {
				fallback_dirty = false;

				fallback_value = lazy
					? untrack(/** @type {() => V} */ (fallback))
					: /** @type {V} */ (fallback);
			}

			return fallback_value;
		};

		/** @type {((v: V) => void) | undefined} */
		var setter;

		if (bindable) {
			// Can be the case when someone does `mount(Component, props)` with `let props = $state({...})`
			// or `createClassComponent(Component, props)`
			var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;

			setter =
				get_descriptor(props, key)?.set ??
				(is_entry_props && key in props ? (v) => (props[key] = v) : undefined);
		}

		var initial_value;
		var is_store_sub = false;

		if (bindable) {
			[initial_value, is_store_sub] = capture_store_binding(() => /** @type {V} */ (props[key]));
		} else {
			initial_value = /** @type {V} */ (props[key]);
		}

		if (initial_value === undefined && fallback !== undefined) {
			initial_value = get_fallback();

			if (setter) {
				if (runes) props_invalid_value();
				setter(initial_value);
			}
		}

		/** @type {() => V} */
		var getter;

		if (runes) {
			getter = () => {
				var value = /** @type {V} */ (props[key]);
				if (value === undefined) return get_fallback();
				fallback_dirty = true;
				return value;
			};
		} else {
			getter = () => {
				var value = /** @type {V} */ (props[key]);

				if (value !== undefined) {
					// in legacy mode, we don't revert to the fallback value
					// if the prop goes from defined to undefined. The easiest
					// way to model this is to make the fallback undefined
					// as soon as the prop has a value
					fallback_value = /** @type {V} */ (undefined);
				}

				return value === undefined ? fallback_value : value;
			};
		}

		// prop is never written to — we only need a getter
		if (runes && (flags & PROPS_IS_UPDATED) === 0) {
			return getter;
		}

		// prop is written to, but the parent component had `bind:foo` which
		// means we can just call `$$props.foo = value` directly
		if (setter) {
			var legacy_parent = props.$$legacy;
			return /** @type {() => V} */ (
				function (/** @type {V} */ value, /** @type {boolean} */ mutation) {
					if (arguments.length > 0) {
						// We don't want to notify if the value was mutated and the parent is in runes mode.
						// In that case the state proxy (if it exists) should take care of the notification.
						// If the parent is not in runes mode, we need to notify on mutation, too, that the prop
						// has changed because the parent will not be able to detect the change otherwise.
						if (!runes || !mutation || legacy_parent || is_store_sub) {
							/** @type {Function} */ (setter)(mutation ? getter() : value);
						}

						return value;
					}

					return getter();
				}
			);
		}

		// Either prop is written to, but there's no binding, which means we
		// create a derived that we can write to locally.
		// Or we are in legacy mode where we always create a derived to replicate that
		// Svelte 4 did not trigger updates when a primitive value was updated to the same value.
		var overridden = false;

		var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
			overridden = false;
			return getter();
		});

		// Capture the initial value if it's bindable
		if (bindable) get$2(d);

		var parent_effect = /** @type {Effect} */ (active_effect);

		return /** @type {() => V} */ (
			function (/** @type {any} */ value, /** @type {boolean} */ mutation) {
				if (arguments.length > 0) {
					const new_value = mutation ? get$2(d) : runes && bindable ? proxy(value) : value;

					set$2(d, new_value);
					overridden = true;

					if (fallback_value !== undefined) {
						fallback_value = new_value;
					}

					return value;
				}

				// special case — avoid recalculating the derived if we're in a
				// teardown function and the prop was overridden locally, or the
				// component was already destroyed (this latter part is necessary
				// because `bind:this` can read props after the component has
				// been destroyed. TODO simplify `bind:this`
				if ((is_destroying_effect && overridden) || (parent_effect.f & DESTROYED) !== 0) {
					return d.v;
				}

				return get$2(d);
			}
		);
	}

	var noop = {value: () => {}};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames$1(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {type: t, name: name};
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function(typename, callback) {
	    var _ = this._,
	        T = parseTypenames$1(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
	      return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
	      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function() {
	    var copy = {}, _ = this._;
	    for (var t in _) copy[t] = _[t].slice();
	    return new Dispatch(copy);
	  },
	  call: function(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get$1(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$1(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({name: name, value: callback});
	  return type;
	}

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
	}

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	}

	function none() {}

	function selector(selector) {
	  return selector == null ? none : function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection$2(subgroups, this._parents);
	}

	// Given something array like (or null), returns something that is strictly an
	// array. This is used to ensure that array-like objects passed to d3.selectAll
	// or selection.selectAll are converted into proper arrays when creating a
	// selection; we don’t ever want to create a selection backed by a live
	// HTMLCollection or NodeList. However, note that selection.selectAll will use a
	// static NodeList as a group, since it safely derived from querySelectorAll.
	function array(x) {
	  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
	}

	function empty() {
	  return [];
	}

	function selectorAll(selector) {
	  return selector == null ? empty : function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function arrayAll(select) {
	  return function() {
	    return array(select.apply(this, arguments));
	  };
	}

	function selection_selectAll(select) {
	  if (typeof select === "function") select = arrayAll(select);
	  else select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection$2(subgroups, parents);
	}

	function matcher(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	}

	function childMatcher(selector) {
	  return function(node) {
	    return node.matches(selector);
	  };
	}

	var find = Array.prototype.find;

	function childFind(match) {
	  return function() {
	    return find.call(this.children, match);
	  };
	}

	function childFirst() {
	  return this.firstElementChild;
	}

	function selection_selectChild(match) {
	  return this.select(match == null ? childFirst
	      : childFind(typeof match === "function" ? match : childMatcher(match)));
	}

	var filter = Array.prototype.filter;

	function children() {
	  return Array.from(this.children);
	}

	function childrenFilter(match) {
	  return function() {
	    return filter.call(this.children, match);
	  };
	}

	function selection_selectChildren(match) {
	  return this.selectAll(match == null ? children
	      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
	}

	function selection_filter(match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection$2(subgroups, this._parents);
	}

	function sparse(update) {
	  return new Array(update.length);
	}

	function selection_enter() {
	  return new Selection$2(this._enter || this._groups.map(sparse), this._parents);
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function constant$3(x) {
	  return function() {
	    return x;
	  };
	}

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = new Map,
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
	      if (nodeByKeyValue.has(keyValue)) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue.set(keyValue, node);
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = key.call(parent, data[i], i, data) + "";
	    if (node = nodeByKeyValue.get(keyValue)) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue.delete(keyValue);
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function datum(node) {
	  return node.__data__;
	}

	function selection_data(value, key) {
	  if (!arguments.length) return Array.from(this, datum);

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant$3(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection$2(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	// Given some data, this returns an array-like view of it: an object that
	// exposes a length property and allows numeric indexing. Note that unlike
	// selectAll, this isn’t worried about “live” collections because the resulting
	// array will only be used briefly while data is being bound. (It is possible to
	// cause the data to change while iterating by using a key function, but please
	// don’t; we’d rather avoid a gratuitous copy.)
	function arraylike(data) {
	  return typeof data === "object" && "length" in data
	    ? data // Array, TypedArray, NodeList, array-like
	    : Array.from(data); // Map, Set, iterable, string, or anything else
	}

	function selection_exit() {
	  return new Selection$2(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_join(onenter, onupdate, onexit) {
	  var enter = this.enter(), update = this, exit = this.exit();
	  if (typeof onenter === "function") {
	    enter = onenter(enter);
	    if (enter) enter = enter.selection();
	  } else {
	    enter = enter.append(onenter + "");
	  }
	  if (onupdate != null) {
	    update = onupdate(update);
	    if (update) update = update.selection();
	  }
	  if (onexit == null) exit.remove(); else onexit(exit);
	  return enter && update ? enter.merge(update).order() : update;
	}

	function selection_merge(context) {
	  var selection = context.selection ? context.selection() : context;

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection$2(merges, this._parents);
	}

	function selection_order() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort(compare) {
	  if (!compare) compare = ascending;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection$2(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes() {
	  return Array.from(this);
	}

	function selection_node() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size() {
	  let size = 0;
	  for (const node of this) ++size; // eslint-disable-line no-unused-vars
	  return size;
	}

	function selection_empty() {
	  return !this.node();
	}

	function selection_each(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove$1(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$1(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$1(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS$1(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction$1(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS$1(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
	      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
	}

	function defaultView(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove$1(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$1(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction$1(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style(name, value, priority) {
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove$1 : typeof value === "function"
	            ? styleFunction$1
	            : styleConstant$1)(name, value, priority == null ? "" : priority))
	      : styleValue(this.node(), name);
	}

	function styleValue(node, name) {
	  return node.style.getPropertyValue(name)
	      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant$1(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction$1(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction$1
	          : textConstant$1)(value))
	      : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise() {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower() {
	  return this.each(lower);
	}

	function selection_append(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove() {
	  return this.each(remove);
	}

	function selection_cloneShallow() {
	  var clone = this.cloneNode(false), parent = this.parentNode;
	  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
	}

	function selection_cloneDeep() {
	  var clone = this.cloneNode(true), parent = this.parentNode;
	  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
	}

	function selection_clone(deep) {
	  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
	}

	function selection_datum(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	function contextListener(listener) {
	  return function(event) {
	    listener.call(this, event, this.__data__);
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.options);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd(typename, value, options) {
	  return function() {
	    var on = this.__on, o, listener = contextListener(value);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.options);
	        this.addEventListener(o.type, o.listener = listener, o.options = options);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, options);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	function selection_on(typename, value, options) {
	  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
	  return this;
	}

	function dispatchEvent(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (typeof event === "function") {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	}

	function* selection_iterator() {
	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) yield node;
	    }
	  }
	}

	var root$g = [null];

	function Selection$2(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection$2([[document.documentElement]], root$g);
	}

	function selection_selection() {
	  return this;
	}

	Selection$2.prototype = selection.prototype = {
	  constructor: Selection$2,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  selectChild: selection_selectChild,
	  selectChildren: selection_selectChildren,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  join: selection_join,
	  merge: selection_merge,
	  selection: selection_selection,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  clone: selection_clone,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch,
	  [Symbol.iterator]: selection_iterator
	};

	function select(selector) {
	  return typeof selector === "string"
	      ? new Selection$2([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection$2([[selector]], root$g);
	}

	function sourceEvent(event) {
	  let sourceEvent;
	  while (sourceEvent = event.sourceEvent) event = sourceEvent;
	  return event;
	}

	function pointer(event, node) {
	  event = sourceEvent(event);
	  if (node === undefined) node = event.currentTarget;
	  if (node) {
	    var svg = node.ownerSVGElement || node;
	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      point.x = event.clientX, point.y = event.clientY;
	      point = point.matrixTransform(node.getScreenCTM().inverse());
	      return [point.x, point.y];
	    }
	    if (node.getBoundingClientRect) {
	      var rect = node.getBoundingClientRect();
	      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	    }
	  }
	  return [event.pageX, event.pageY];
	}

	// These are typically used in conjunction with noevent to ensure that we can
	// preventDefault on the event.
	const nonpassive = {passive: false};
	const nonpassivecapture = {capture: true, passive: false};

	function nopropagation$1(event) {
	  event.stopImmediatePropagation();
	}

	function noevent$1(event) {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	function dragDisable(view) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", noevent$1, nonpassivecapture);
	  } else {
	    root.__noselect = root.style.MozUserSelect;
	    root.style.MozUserSelect = "none";
	  }
	}

	function yesdrag(view, noclick) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", null);
	  if (noclick) {
	    selection.on("click.drag", noevent$1, nonpassivecapture);
	    setTimeout(function() { selection.on("click.drag", null); }, 0);
	  }
	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", null);
	  } else {
	    root.style.MozUserSelect = root.__noselect;
	    delete root.__noselect;
	  }
	}

	var constant$2 = x => () => x;

	function DragEvent(type, {
	  sourceEvent,
	  subject,
	  target,
	  identifier,
	  active,
	  x, y, dx, dy,
	  dispatch
	}) {
	  Object.defineProperties(this, {
	    type: {value: type, enumerable: true, configurable: true},
	    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
	    subject: {value: subject, enumerable: true, configurable: true},
	    target: {value: target, enumerable: true, configurable: true},
	    identifier: {value: identifier, enumerable: true, configurable: true},
	    active: {value: active, enumerable: true, configurable: true},
	    x: {value: x, enumerable: true, configurable: true},
	    y: {value: y, enumerable: true, configurable: true},
	    dx: {value: dx, enumerable: true, configurable: true},
	    dy: {value: dy, enumerable: true, configurable: true},
	    _: {value: dispatch}
	  });
	}

	DragEvent.prototype.on = function() {
	  var value = this._.on.apply(this._, arguments);
	  return value === this._ ? this : value;
	};

	// Ignore right-click, since that should open the context menu.
	function defaultFilter$1(event) {
	  return !event.ctrlKey && !event.button;
	}

	function defaultContainer() {
	  return this.parentNode;
	}

	function defaultSubject(event, d) {
	  return d == null ? {x: event.x, y: event.y} : d;
	}

	function defaultTouchable$1() {
	  return navigator.maxTouchPoints || ("ontouchstart" in this);
	}

	function drag$1() {
	  var filter = defaultFilter$1,
	      container = defaultContainer,
	      subject = defaultSubject,
	      touchable = defaultTouchable$1,
	      gestures = {},
	      listeners = dispatch("start", "drag", "end"),
	      active = 0,
	      mousedownx,
	      mousedowny,
	      mousemoving,
	      touchending,
	      clickDistance2 = 0;

	  function drag(selection) {
	    selection
	        .on("mousedown.drag", mousedowned)
	      .filter(touchable)
	        .on("touchstart.drag", touchstarted)
	        .on("touchmove.drag", touchmoved, nonpassive)
	        .on("touchend.drag touchcancel.drag", touchended)
	        .style("touch-action", "none")
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  function mousedowned(event, d) {
	    if (touchending || !filter.call(this, event, d)) return;
	    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
	    if (!gesture) return;
	    select(event.view)
	      .on("mousemove.drag", mousemoved, nonpassivecapture)
	      .on("mouseup.drag", mouseupped, nonpassivecapture);
	    dragDisable(event.view);
	    nopropagation$1(event);
	    mousemoving = false;
	    mousedownx = event.clientX;
	    mousedowny = event.clientY;
	    gesture("start", event);
	  }

	  function mousemoved(event) {
	    noevent$1(event);
	    if (!mousemoving) {
	      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
	      mousemoving = dx * dx + dy * dy > clickDistance2;
	    }
	    gestures.mouse("drag", event);
	  }

	  function mouseupped(event) {
	    select(event.view).on("mousemove.drag mouseup.drag", null);
	    yesdrag(event.view, mousemoving);
	    noevent$1(event);
	    gestures.mouse("end", event);
	  }

	  function touchstarted(event, d) {
	    if (!filter.call(this, event, d)) return;
	    var touches = event.changedTouches,
	        c = container.call(this, event, d),
	        n = touches.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
	        nopropagation$1(event);
	        gesture("start", event, touches[i]);
	      }
	    }
	  }

	  function touchmoved(event) {
	    var touches = event.changedTouches,
	        n = touches.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches[i].identifier]) {
	        noevent$1(event);
	        gesture("drag", event, touches[i]);
	      }
	    }
	  }

	  function touchended(event) {
	    var touches = event.changedTouches,
	        n = touches.length, i, gesture;

	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches[i].identifier]) {
	        nopropagation$1(event);
	        gesture("end", event, touches[i]);
	      }
	    }
	  }

	  function beforestart(that, container, event, d, identifier, touch) {
	    var dispatch = listeners.copy(),
	        p = pointer(touch || event, container), dx, dy,
	        s;

	    if ((s = subject.call(that, new DragEvent("beforestart", {
	        sourceEvent: event,
	        target: drag,
	        identifier,
	        active,
	        x: p[0],
	        y: p[1],
	        dx: 0,
	        dy: 0,
	        dispatch
	      }), d)) == null) return;

	    dx = s.x - p[0] || 0;
	    dy = s.y - p[1] || 0;

	    return function gesture(type, event, touch) {
	      var p0 = p, n;
	      switch (type) {
	        case "start": gestures[identifier] = gesture, n = active++; break;
	        case "end": delete gestures[identifier], --active; // falls through
	        case "drag": p = pointer(touch || event, container), n = active; break;
	      }
	      dispatch.call(
	        type,
	        that,
	        new DragEvent(type, {
	          sourceEvent: event,
	          subject: s,
	          target: drag,
	          identifier,
	          active: n,
	          x: p[0] + dx,
	          y: p[1] + dy,
	          dx: p[0] - p0[0],
	          dy: p[1] - p0[1],
	          dispatch
	        }),
	        d
	      );
	    };
	  }

	  drag.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), drag) : filter;
	  };

	  drag.container = function(_) {
	    return arguments.length ? (container = typeof _ === "function" ? _ : constant$2(_), drag) : container;
	  };

	  drag.subject = function(_) {
	    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$2(_), drag) : subject;
	  };

	  drag.touchable = function(_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), drag) : touchable;
	  };

	  drag.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? drag : value;
	  };

	  drag.clickDistance = function(_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
	  };

	  return drag;
	}

	function define(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reI = "\\s*([+-]?\\d+)\\s*",
	    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
	    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
	    reHex = /^#([0-9a-f]{3,8})$/,
	    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
	    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
	    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
	    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
	    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
	    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define(Color, color, {
	  copy(channels) {
	    return Object.assign(new this.constructor, this, channels);
	  },
	  displayable() {
	    return this.rgb().displayable();
	  },
	  hex: color_formatHex, // Deprecated! Use color.formatHex.
	  formatHex: color_formatHex,
	  formatHex8: color_formatHex8,
	  formatHsl: color_formatHsl,
	  formatRgb: color_formatRgb,
	  toString: color_formatRgb
	});

	function color_formatHex() {
	  return this.rgb().formatHex();
	}

	function color_formatHex8() {
	  return this.rgb().formatHex8();
	}

	function color_formatHsl() {
	  return hslConvert(this).formatHsl();
	}

	function color_formatRgb() {
	  return this.rgb().formatRgb();
	}

	function color(format) {
	  var m, l;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
	      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
	      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
	      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
	      : null) // invalid hex
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Rgb, rgb, extend(Color, {
	  brighter(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb() {
	    return this;
	  },
	  clamp() {
	    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
	  },
	  displayable() {
	    return (-0.5 <= this.r && this.r < 255.5)
	        && (-0.5 <= this.g && this.g < 255.5)
	        && (-0.5 <= this.b && this.b < 255.5)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
	  formatHex: rgb_formatHex,
	  formatHex8: rgb_formatHex8,
	  formatRgb: rgb_formatRgb,
	  toString: rgb_formatRgb
	}));

	function rgb_formatHex() {
	  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
	}

	function rgb_formatHex8() {
	  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
	}

	function rgb_formatRgb() {
	  const a = clampa(this.opacity);
	  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
	}

	function clampa(opacity) {
	  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
	}

	function clampi(value) {
	  return Math.max(0, Math.min(255, Math.round(value) || 0));
	}

	function hex(value) {
	  value = clampi(value);
	  return (value < 16 ? "0" : "") + value.toString(16);
	}

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  clamp() {
	    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
	  },
	  displayable() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  formatHsl() {
	    const a = clampa(this.opacity);
	    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
	  }
	}));

	function clamph(value) {
	  value = (value || 0) % 360;
	  return value < 0 ? value + 360 : value;
	}

	function clampt(value) {
	  return Math.max(0, Math.min(1, value || 0));
	}

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var constant$1 = x => () => x;

	function linear(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
	}

	var interpolateRgb = (function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb$1(start, end) {
	    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$1.gamma = rgbGamma;

	  return rgb$1;
	})(1);

	function numberArray(a, b) {
	  if (!b) b = [];
	  var n = a ? Math.min(b.length, a.length) : 0,
	      c = b.slice(),
	      i;
	  return function(t) {
	    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
	    return c;
	  };
	}

	function isNumberArray(x) {
	  return ArrayBuffer.isView(x) && !(x instanceof DataView);
	}

	function genericArray(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(na),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	}

	function date(a, b) {
	  var d = new Date;
	  return a = +a, b = +b, function(t) {
	    return d.setTime(a * (1 - t) + b * t), d;
	  };
	}

	function interpolateNumber(a, b) {
	  return a = +a, b = +b, function(t) {
	    return a * (1 - t) + b * t;
	  };
	}

	function object(a, b) {
	  var i = {},
	      c = {},
	      k;

	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = interpolate$1(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function(t) {
	    for (k in i) c[k] = i[k](t);
	    return c;
	  };
	}

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	    reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function interpolateString(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: interpolateNumber(am, bm)});
	    }
	    bi = reB.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	function interpolate$1(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant$1(b)
	      : (t === "number" ? interpolateNumber
	      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
	      : b instanceof color ? interpolateRgb
	      : b instanceof Date ? date
	      : isNumberArray(b) ? numberArray
	      : Array.isArray(b) ? genericArray
	      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
	      : interpolateNumber)(a, b);
	}

	var degrees = 180 / Math.PI;

	var identity$1 = {
	  translateX: 0,
	  translateY: 0,
	  rotate: 0,
	  skewX: 0,
	  scaleX: 1,
	  scaleY: 1
	};

	function decompose(a, b, c, d, e, f) {
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	}

	var svgNode;

	/* eslint-disable no-undef */
	function parseCss(value) {
	  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
	  return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
	}

	function parseSvg(value) {
	  if (value == null) return identity$1;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}

	function interpolateTransform(parse, pxComma, pxParen, degParen) {

	  function pop(s) {
	    return s.length ? s.pop() + " " : "";
	  }

	  function translate(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push("translate(", null, pxComma, null, pxParen);
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb || yb) {
	      s.push("translate(" + xb + pxComma + yb + pxParen);
	    }
	  }

	  function rotate(a, b, s, q) {
	    if (a !== b) {
	      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
	      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "rotate(" + b + degParen);
	    }
	  }

	  function skewX(a, b, s, q) {
	    if (a !== b) {
	      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "skewX(" + b + degParen);
	    }
	  }

	  function scale(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb !== 1 || yb !== 1) {
	      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	    }
	  }

	  return function(a, b) {
	    var s = [], // string constants and placeholders
	        q = []; // number interpolators
	    a = parse(a), b = parse(b);
	    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skewX(a.skewX, b.skewX, s, q);
	    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	    a = b = null; // gc
	    return function(t) {
	      var i = -1, n = q.length, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  };
	}

	var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	var epsilon2 = 1e-12;

	function cosh(x) {
	  return ((x = Math.exp(x)) + 1 / x) / 2;
	}

	function sinh(x) {
	  return ((x = Math.exp(x)) - 1 / x) / 2;
	}

	function tanh(x) {
	  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	}

	var interpolateZoom = (function zoomRho(rho, rho2, rho4) {

	  // p0 = [ux0, uy0, w0]
	  // p1 = [ux1, uy1, w1]
	  function zoom(p0, p1) {
	    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
	        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
	        dx = ux1 - ux0,
	        dy = uy1 - uy0,
	        d2 = dx * dx + dy * dy,
	        i,
	        S;

	    // Special case for u0 ≅ u1.
	    if (d2 < epsilon2) {
	      S = Math.log(w1 / w0) / rho;
	      i = function(t) {
	        return [
	          ux0 + t * dx,
	          uy0 + t * dy,
	          w0 * Math.exp(rho * t * S)
	        ];
	      };
	    }

	    // General case.
	    else {
	      var d1 = Math.sqrt(d2),
	          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	      S = (r1 - r0) / rho;
	      i = function(t) {
	        var s = t * S,
	            coshr0 = cosh(r0),
	            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	        return [
	          ux0 + u * dx,
	          uy0 + u * dy,
	          w0 * coshr0 / cosh(rho * s + r0)
	        ];
	      };
	    }

	    i.duration = S * 1000 * rho / Math.SQRT2;

	    return i;
	  }

	  zoom.rho = function(_) {
	    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
	    return zoomRho(_1, _2, _4);
	  };

	  return zoom;
	})(Math.SQRT2, 2, 4);

	var frame = 0, // is an animation frame pending?
	    timeout$1 = 0, // is a timeout pending?
	    interval = 0, // are any timers active?
	    pokeDelay = 1000, // how frequently we check for clock skew
	    taskHead,
	    taskTail,
	    clockLast = 0,
	    clockNow = 0,
	    clockSkew = 0,
	    clock = typeof performance === "object" && performance.now ? performance : Date,
	    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

	function now() {
	  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	}

	function clearNow() {
	  clockNow = 0;
	}

	function Timer() {
	  this._call =
	  this._time =
	  this._next = null;
	}

	Timer.prototype = timer.prototype = {
	  constructor: Timer,
	  restart: function(callback, delay, time) {
	    if (typeof callback !== "function") throw new TypeError("callback is not a function");
	    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
	    if (!this._next && taskTail !== this) {
	      if (taskTail) taskTail._next = this;
	      else taskHead = this;
	      taskTail = this;
	    }
	    this._call = callback;
	    this._time = time;
	    sleep();
	  },
	  stop: function() {
	    if (this._call) {
	      this._call = null;
	      this._time = Infinity;
	      sleep();
	    }
	  }
	};

	function timer(callback, delay, time) {
	  var t = new Timer;
	  t.restart(callback, delay, time);
	  return t;
	}

	function timerFlush() {
	  now(); // Get the current time, if not already set.
	  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
	  var t = taskHead, e;
	  while (t) {
	    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
	    t = t._next;
	  }
	  --frame;
	}

	function wake() {
	  clockNow = (clockLast = clock.now()) + clockSkew;
	  frame = timeout$1 = 0;
	  try {
	    timerFlush();
	  } finally {
	    frame = 0;
	    nap();
	    clockNow = 0;
	  }
	}

	function poke() {
	  var now = clock.now(), delay = now - clockLast;
	  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	}

	function nap() {
	  var t0, t1 = taskHead, t2, time = Infinity;
	  while (t1) {
	    if (t1._call) {
	      if (time > t1._time) time = t1._time;
	      t0 = t1, t1 = t1._next;
	    } else {
	      t2 = t1._next, t1._next = null;
	      t1 = t0 ? t0._next = t2 : taskHead = t2;
	    }
	  }
	  taskTail = t0;
	  sleep(time);
	}

	function sleep(time) {
	  if (frame) return; // Soonest alarm already set, or will be.
	  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
	  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
	  if (delay > 24) {
	    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
	    if (interval) interval = clearInterval(interval);
	  } else {
	    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
	    frame = 1, setFrame(wake);
	  }
	}

	function timeout(callback, delay, time) {
	  var t = new Timer;
	  delay = delay == null ? 0 : +delay;
	  t.restart(elapsed => {
	    t.stop();
	    callback(elapsed + delay);
	  }, delay, time);
	  return t;
	}

	var emptyOn = dispatch("start", "end", "cancel", "interrupt");
	var emptyTween = [];

	var CREATED = 0;
	var SCHEDULED = 1;
	var STARTING = 2;
	var STARTED = 3;
	var RUNNING = 4;
	var ENDING = 5;
	var ENDED = 6;

	function schedule(node, name, id, index, group, timing) {
	  var schedules = node.__transition;
	  if (!schedules) node.__transition = {};
	  else if (id in schedules) return;
	  create(node, id, {
	    name: name,
	    index: index, // For context during callback.
	    group: group, // For context during callback.
	    on: emptyOn,
	    tween: emptyTween,
	    time: timing.time,
	    delay: timing.delay,
	    duration: timing.duration,
	    ease: timing.ease,
	    timer: null,
	    state: CREATED
	  });
	}

	function init(node, id) {
	  var schedule = get(node, id);
	  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
	  return schedule;
	}

	function set(node, id) {
	  var schedule = get(node, id);
	  if (schedule.state > STARTED) throw new Error("too late; already running");
	  return schedule;
	}

	function get(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
	  return schedule;
	}

	function create(node, id, self) {
	  var schedules = node.__transition,
	      tween;

	  // Initialize the self timer when the transition is created.
	  // Note the actual delay is not known until the first callback!
	  schedules[id] = self;
	  self.timer = timer(schedule, 0, self.time);

	  function schedule(elapsed) {
	    self.state = SCHEDULED;
	    self.timer.restart(start, self.delay, self.time);

	    // If the elapsed delay is less than our first sleep, start immediately.
	    if (self.delay <= elapsed) start(elapsed - self.delay);
	  }

	  function start(elapsed) {
	    var i, j, n, o;

	    // If the state is not SCHEDULED, then we previously errored on start.
	    if (self.state !== SCHEDULED) return stop();

	    for (i in schedules) {
	      o = schedules[i];
	      if (o.name !== self.name) continue;

	      // While this element already has a starting transition during this frame,
	      // defer starting an interrupting transition until that transition has a
	      // chance to tick (and possibly end); see d3/d3-transition#54!
	      if (o.state === STARTED) return timeout(start);

	      // Interrupt the active transition, if any.
	      if (o.state === RUNNING) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("interrupt", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }

	      // Cancel any pre-empted transitions.
	      else if (+i < id) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("cancel", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }
	    }

	    // Defer the first tick to end of the current frame; see d3/d3#1576.
	    // Note the transition may be canceled after start and before the first tick!
	    // Note this must be scheduled before the start event; see d3/d3-transition#16!
	    // Assuming this is successful, subsequent callbacks go straight to tick.
	    timeout(function() {
	      if (self.state === STARTED) {
	        self.state = RUNNING;
	        self.timer.restart(tick, self.delay, self.time);
	        tick(elapsed);
	      }
	    });

	    // Dispatch the start event.
	    // Note this must be done before the tween are initialized.
	    self.state = STARTING;
	    self.on.call("start", node, node.__data__, self.index, self.group);
	    if (self.state !== STARTING) return; // interrupted
	    self.state = STARTED;

	    // Initialize the tween, deleting null tween.
	    tween = new Array(n = self.tween.length);
	    for (i = 0, j = -1; i < n; ++i) {
	      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	        tween[++j] = o;
	      }
	    }
	    tween.length = j + 1;
	  }

	  function tick(elapsed) {
	    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
	        i = -1,
	        n = tween.length;

	    while (++i < n) {
	      tween[i].call(node, t);
	    }

	    // Dispatch the end event.
	    if (self.state === ENDING) {
	      self.on.call("end", node, node.__data__, self.index, self.group);
	      stop();
	    }
	  }

	  function stop() {
	    self.state = ENDED;
	    self.timer.stop();
	    delete schedules[id];
	    for (var i in schedules) return; // eslint-disable-line no-unused-vars
	    delete node.__transition;
	  }
	}

	function interrupt(node, name) {
	  var schedules = node.__transition,
	      schedule,
	      active,
	      empty = true,
	      i;

	  if (!schedules) return;

	  name = name == null ? null : name + "";

	  for (i in schedules) {
	    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
	    active = schedule.state > STARTING && schedule.state < ENDING;
	    schedule.state = ENDED;
	    schedule.timer.stop();
	    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
	    delete schedules[i];
	  }

	  if (empty) delete node.__transition;
	}

	function selection_interrupt(name) {
	  return this.each(function() {
	    interrupt(this, name);
	  });
	}

	function tweenRemove(id, name) {
	  var tween0, tween1;
	  return function() {
	    var schedule = set(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = tween0 = tween;
	      for (var i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1 = tween1.slice();
	          tween1.splice(i, 1);
	          break;
	        }
	      }
	    }

	    schedule.tween = tween1;
	  };
	}

	function tweenFunction(id, name, value) {
	  var tween0, tween1;
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    var schedule = set(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = (tween0 = tween).slice();
	      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1[i] = t;
	          break;
	        }
	      }
	      if (i === n) tween1.push(t);
	    }

	    schedule.tween = tween1;
	  };
	}

	function transition_tween(name, value) {
	  var id = this._id;

	  name += "";

	  if (arguments.length < 2) {
	    var tween = get(this.node(), id).tween;
	    for (var i = 0, n = tween.length, t; i < n; ++i) {
	      if ((t = tween[i]).name === name) {
	        return t.value;
	      }
	    }
	    return null;
	  }

	  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	}

	function tweenValue(transition, name, value) {
	  var id = transition._id;

	  transition.each(function() {
	    var schedule = set(this, id);
	    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	  });

	  return function(node) {
	    return get(node, id).value[name];
	  };
	}

	function interpolate(a, b) {
	  var c;
	  return (typeof b === "number" ? interpolateNumber
	      : b instanceof color ? interpolateRgb
	      : (c = color(b)) ? (b = c, interpolateRgb)
	      : interpolateString)(a, b);
	}

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = this.getAttribute(name);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrConstantNS(fullname, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = this.getAttributeNS(fullname.space, fullname.local);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrFunction(name, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0, value1 = value(this), string1;
	    if (value1 == null) return void this.removeAttribute(name);
	    string0 = this.getAttribute(name);
	    string1 = value1 + "";
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function attrFunctionNS(fullname, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0, value1 = value(this), string1;
	    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	    string0 = this.getAttributeNS(fullname.space, fullname.local);
	    string1 = value1 + "";
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function transition_attr(name, value) {
	  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
	  return this.attrTween(name, typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
	      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
	      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
	}

	function attrInterpolate(name, i) {
	  return function(t) {
	    this.setAttribute(name, i.call(this, t));
	  };
	}

	function attrInterpolateNS(fullname, i) {
	  return function(t) {
	    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
	  };
	}

	function attrTweenNS(fullname, value) {
	  var t0, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
	    return t0;
	  }
	  tween._value = value;
	  return tween;
	}

	function attrTween(name, value) {
	  var t0, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
	    return t0;
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_attrTween(name, value) {
	  var key = "attr." + name;
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  var fullname = namespace(name);
	  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	}

	function delayFunction(id, value) {
	  return function() {
	    init(this, id).delay = +value.apply(this, arguments);
	  };
	}

	function delayConstant(id, value) {
	  return value = +value, function() {
	    init(this, id).delay = value;
	  };
	}

	function transition_delay(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? delayFunction
	          : delayConstant)(id, value))
	      : get(this.node(), id).delay;
	}

	function durationFunction(id, value) {
	  return function() {
	    set(this, id).duration = +value.apply(this, arguments);
	  };
	}

	function durationConstant(id, value) {
	  return value = +value, function() {
	    set(this, id).duration = value;
	  };
	}

	function transition_duration(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? durationFunction
	          : durationConstant)(id, value))
	      : get(this.node(), id).duration;
	}

	function easeConstant(id, value) {
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    set(this, id).ease = value;
	  };
	}

	function transition_ease(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each(easeConstant(id, value))
	      : get(this.node(), id).ease;
	}

	function easeVarying(id, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (typeof v !== "function") throw new Error;
	    set(this, id).ease = v;
	  };
	}

	function transition_easeVarying(value) {
	  if (typeof value !== "function") throw new Error;
	  return this.each(easeVarying(this._id, value));
	}

	function transition_filter(match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, this._name, this._id);
	}

	function transition_merge(transition) {
	  if (transition._id !== this._id) throw new Error;

	  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Transition(merges, this._parents, this._name, this._id);
	}

	function start(name) {
	  return (name + "").trim().split(/^|\s+/).every(function(t) {
	    var i = t.indexOf(".");
	    if (i >= 0) t = t.slice(0, i);
	    return !t || t === "start";
	  });
	}

	function onFunction(id, name, listener) {
	  var on0, on1, sit = start(name) ? init : set;
	  return function() {
	    var schedule = sit(this, id),
	        on = schedule.on;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

	    schedule.on = on1;
	  };
	}

	function transition_on(name, listener) {
	  var id = this._id;

	  return arguments.length < 2
	      ? get(this.node(), id).on.on(name)
	      : this.each(onFunction(id, name, listener));
	}

	function removeFunction(id) {
	  return function() {
	    var parent = this.parentNode;
	    for (var i in this.__transition) if (+i !== id) return;
	    if (parent) parent.removeChild(this);
	  };
	}

	function transition_remove() {
	  return this.on("end.remove", removeFunction(this._id));
	}

	function transition_select(select) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, name, id);
	}

	function transition_selectAll(select) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
	          if (child = children[k]) {
	            schedule(child, name, id, k, children, inherit);
	          }
	        }
	        subgroups.push(children);
	        parents.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, parents, name, id);
	}

	var Selection$1 = selection.prototype.constructor;

	function transition_selection() {
	  return new Selection$1(this._groups, this._parents);
	}

	function styleNull(name, interpolate) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name),
	        string1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, string10 = string1);
	  };
	}

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function styleFunction(name, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name),
	        value1 = value(this),
	        string1 = value1 + "";
	    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function styleMaybeRemove(id, name) {
	  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
	  return function() {
	    var schedule = set(this, id),
	        on = schedule.on,
	        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

	    schedule.on = on1;
	  };
	}

	function transition_style(name, value, priority) {
	  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
	  return value == null ? this
	      .styleTween(name, styleNull(name, i))
	      .on("end.style." + name, styleRemove(name))
	    : typeof value === "function" ? this
	      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
	      .each(styleMaybeRemove(this._id, name))
	    : this
	      .styleTween(name, styleConstant(name, i, value), priority)
	      .on("end.style." + name, null);
	}

	function styleInterpolate(name, i, priority) {
	  return function(t) {
	    this.style.setProperty(name, i.call(this, t), priority);
	  };
	}

	function styleTween(name, value, priority) {
	  var t, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
	    return t;
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_styleTween(name, value, priority) {
	  var key = "style." + (name += "");
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var value1 = value(this);
	    this.textContent = value1 == null ? "" : value1;
	  };
	}

	function transition_text(value) {
	  return this.tween("text", typeof value === "function"
	      ? textFunction(tweenValue(this, "text", value))
	      : textConstant(value == null ? "" : value + ""));
	}

	function textInterpolate(i) {
	  return function(t) {
	    this.textContent = i.call(this, t);
	  };
	}

	function textTween(value) {
	  var t0, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
	    return t0;
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_textTween(value) {
	  var key = "text";
	  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  return this.tween(key, textTween(value));
	}

	function transition_transition() {
	  var name = this._name,
	      id0 = this._id,
	      id1 = newId();

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        var inherit = get(node, id0);
	        schedule(node, name, id1, i, group, {
	          time: inherit.time + inherit.delay + inherit.duration,
	          delay: 0,
	          duration: inherit.duration,
	          ease: inherit.ease
	        });
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id1);
	}

	function transition_end() {
	  var on0, on1, that = this, id = that._id, size = that.size();
	  return new Promise(function(resolve, reject) {
	    var cancel = {value: reject},
	        end = {value: function() { if (--size === 0) resolve(); }};

	    that.each(function() {
	      var schedule = set(this, id),
	          on = schedule.on;

	      // If this node shared a dispatch with the previous node,
	      // just assign the updated shared dispatch and we’re done!
	      // Otherwise, copy-on-write.
	      if (on !== on0) {
	        on1 = (on0 = on).copy();
	        on1._.cancel.push(cancel);
	        on1._.interrupt.push(cancel);
	        on1._.end.push(end);
	      }

	      schedule.on = on1;
	    });

	    // The selection was empty, resolve end immediately
	    if (size === 0) resolve();
	  });
	}

	var id = 0;

	function Transition(groups, parents, name, id) {
	  this._groups = groups;
	  this._parents = parents;
	  this._name = name;
	  this._id = id;
	}

	function newId() {
	  return ++id;
	}

	var selection_prototype = selection.prototype;

	Transition.prototype = {
	  constructor: Transition,
	  select: transition_select,
	  selectAll: transition_selectAll,
	  selectChild: selection_prototype.selectChild,
	  selectChildren: selection_prototype.selectChildren,
	  filter: transition_filter,
	  merge: transition_merge,
	  selection: transition_selection,
	  transition: transition_transition,
	  call: selection_prototype.call,
	  nodes: selection_prototype.nodes,
	  node: selection_prototype.node,
	  size: selection_prototype.size,
	  empty: selection_prototype.empty,
	  each: selection_prototype.each,
	  on: transition_on,
	  attr: transition_attr,
	  attrTween: transition_attrTween,
	  style: transition_style,
	  styleTween: transition_styleTween,
	  text: transition_text,
	  textTween: transition_textTween,
	  remove: transition_remove,
	  tween: transition_tween,
	  delay: transition_delay,
	  duration: transition_duration,
	  ease: transition_ease,
	  easeVarying: transition_easeVarying,
	  end: transition_end,
	  [Symbol.iterator]: selection_prototype[Symbol.iterator]
	};

	function cubicInOut(t) {
	  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	}

	var defaultTiming = {
	  time: null, // Set on use.
	  delay: 0,
	  duration: 250,
	  ease: cubicInOut
	};

	function inherit(node, id) {
	  var timing;
	  while (!(timing = node.__transition) || !(timing = timing[id])) {
	    if (!(node = node.parentNode)) {
	      throw new Error(`transition ${id} not found`);
	    }
	  }
	  return timing;
	}

	function selection_transition(name) {
	  var id,
	      timing;

	  if (name instanceof Transition) {
	    id = name._id, name = name._name;
	  } else {
	    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	  }

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        schedule(node, name, id, i, group, timing || inherit(node, id));
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id);
	}

	selection.prototype.interrupt = selection_interrupt;
	selection.prototype.transition = selection_transition;

	var constant = x => () => x;

	function ZoomEvent(type, {
	  sourceEvent,
	  target,
	  transform,
	  dispatch
	}) {
	  Object.defineProperties(this, {
	    type: {value: type, enumerable: true, configurable: true},
	    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
	    target: {value: target, enumerable: true, configurable: true},
	    transform: {value: transform, enumerable: true, configurable: true},
	    _: {value: dispatch}
	  });
	}

	function Transform(k, x, y) {
	  this.k = k;
	  this.x = x;
	  this.y = y;
	}

	Transform.prototype = {
	  constructor: Transform,
	  scale: function(k) {
	    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	  },
	  translate: function(x, y) {
	    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	  },
	  apply: function(point) {
	    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	  },
	  applyX: function(x) {
	    return x * this.k + this.x;
	  },
	  applyY: function(y) {
	    return y * this.k + this.y;
	  },
	  invert: function(location) {
	    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	  },
	  invertX: function(x) {
	    return (x - this.x) / this.k;
	  },
	  invertY: function(y) {
	    return (y - this.y) / this.k;
	  },
	  rescaleX: function(x) {
	    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	  },
	  rescaleY: function(y) {
	    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	  },
	  toString: function() {
	    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	  }
	};

	var identity = new Transform(1, 0, 0);

	transform.prototype = Transform.prototype;

	function transform(node) {
	  while (!node.__zoom) if (!(node = node.parentNode)) return identity;
	  return node.__zoom;
	}

	function nopropagation(event) {
	  event.stopImmediatePropagation();
	}

	function noevent(event) {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	// Ignore right-click, since that should open the context menu.
	// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
	function defaultFilter(event) {
	  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
	}

	function defaultExtent() {
	  var e = this;
	  if (e instanceof SVGElement) {
	    e = e.ownerSVGElement || e;
	    if (e.hasAttribute("viewBox")) {
	      e = e.viewBox.baseVal;
	      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
	    }
	    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
	  }
	  return [[0, 0], [e.clientWidth, e.clientHeight]];
	}

	function defaultTransform() {
	  return this.__zoom || identity;
	}

	function defaultWheelDelta(event) {
	  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
	}

	function defaultTouchable() {
	  return navigator.maxTouchPoints || ("ontouchstart" in this);
	}

	function defaultConstrain(transform, extent, translateExtent) {
	  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
	      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
	      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
	      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
	  return transform.translate(
	    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
	    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
	  );
	}

	function zoom$1() {
	  var filter = defaultFilter,
	      extent = defaultExtent,
	      constrain = defaultConstrain,
	      wheelDelta = defaultWheelDelta,
	      touchable = defaultTouchable,
	      scaleExtent = [0, Infinity],
	      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
	      duration = 250,
	      interpolate = interpolateZoom,
	      listeners = dispatch("start", "zoom", "end"),
	      touchstarting,
	      touchfirst,
	      touchending,
	      touchDelay = 500,
	      wheelDelay = 150,
	      clickDistance2 = 0,
	      tapDistance = 10;

	  function zoom(selection) {
	    selection
	        .property("__zoom", defaultTransform)
	        .on("wheel.zoom", wheeled, {passive: false})
	        .on("mousedown.zoom", mousedowned)
	        .on("dblclick.zoom", dblclicked)
	      .filter(touchable)
	        .on("touchstart.zoom", touchstarted)
	        .on("touchmove.zoom", touchmoved)
	        .on("touchend.zoom touchcancel.zoom", touchended)
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  zoom.transform = function(collection, transform, point, event) {
	    var selection = collection.selection ? collection.selection() : collection;
	    selection.property("__zoom", defaultTransform);
	    if (collection !== selection) {
	      schedule(collection, transform, point, event);
	    } else {
	      selection.interrupt().each(function() {
	        gesture(this, arguments)
	          .event(event)
	          .start()
	          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
	          .end();
	      });
	    }
	  };

	  zoom.scaleBy = function(selection, k, p, event) {
	    zoom.scaleTo(selection, function() {
	      var k0 = this.__zoom.k,
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return k0 * k1;
	    }, p, event);
	  };

	  zoom.scaleTo = function(selection, k, p, event) {
	    zoom.transform(selection, function() {
	      var e = extent.apply(this, arguments),
	          t0 = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
	          p1 = t0.invert(p0),
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
	    }, p, event);
	  };

	  zoom.translateBy = function(selection, x, y, event) {
	    zoom.transform(selection, function() {
	      return constrain(this.__zoom.translate(
	        typeof x === "function" ? x.apply(this, arguments) : x,
	        typeof y === "function" ? y.apply(this, arguments) : y
	      ), extent.apply(this, arguments), translateExtent);
	    }, null, event);
	  };

	  zoom.translateTo = function(selection, x, y, p, event) {
	    zoom.transform(selection, function() {
	      var e = extent.apply(this, arguments),
	          t = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
	      return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
	        typeof x === "function" ? -x.apply(this, arguments) : -x,
	        typeof y === "function" ? -y.apply(this, arguments) : -y
	      ), e, translateExtent);
	    }, p, event);
	  };

	  function scale(transform, k) {
	    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
	    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	  }

	  function translate(transform, p0, p1) {
	    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
	    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	  }

	  function centroid(extent) {
	    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
	  }

	  function schedule(transition, transform, point, event) {
	    transition
	        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
	        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
	        .tween("zoom", function() {
	          var that = this,
	              args = arguments,
	              g = gesture(that, args).event(event),
	              e = extent.apply(that, args),
	              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
	              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
	              a = that.__zoom,
	              b = typeof transform === "function" ? transform.apply(that, args) : transform,
	              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
	          return function(t) {
	            if (t === 1) t = b; // Avoid rounding error on end.
	            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
	            g.zoom(null, t);
	          };
	        });
	  }

	  function gesture(that, args, clean) {
	    return (!clean && that.__zooming) || new Gesture(that, args);
	  }

	  function Gesture(that, args) {
	    this.that = that;
	    this.args = args;
	    this.active = 0;
	    this.sourceEvent = null;
	    this.extent = extent.apply(that, args);
	    this.taps = 0;
	  }

	  Gesture.prototype = {
	    event: function(event) {
	      if (event) this.sourceEvent = event;
	      return this;
	    },
	    start: function() {
	      if (++this.active === 1) {
	        this.that.__zooming = this;
	        this.emit("start");
	      }
	      return this;
	    },
	    zoom: function(key, transform) {
	      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
	      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
	      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
	      this.that.__zoom = transform;
	      this.emit("zoom");
	      return this;
	    },
	    end: function() {
	      if (--this.active === 0) {
	        delete this.that.__zooming;
	        this.emit("end");
	      }
	      return this;
	    },
	    emit: function(type) {
	      var d = select(this.that).datum();
	      listeners.call(
	        type,
	        this.that,
	        new ZoomEvent(type, {
	          sourceEvent: this.sourceEvent,
	          target: zoom,
	          transform: this.that.__zoom,
	          dispatch: listeners
	        }),
	        d
	      );
	    }
	  };

	  function wheeled(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var g = gesture(this, args).event(event),
	        t = this.__zoom,
	        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
	        p = pointer(event);

	    // If the mouse is in the same location as before, reuse it.
	    // If there were recent wheel events, reset the wheel idle timeout.
	    if (g.wheel) {
	      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
	        g.mouse[1] = t.invert(g.mouse[0] = p);
	      }
	      clearTimeout(g.wheel);
	    }

	    // If this wheel event won’t trigger a transform change, ignore it.
	    else if (t.k === k) return;

	    // Otherwise, capture the mouse point and location at the start.
	    else {
	      g.mouse = [p, t.invert(p)];
	      interrupt(this);
	      g.start();
	    }

	    noevent(event);
	    g.wheel = setTimeout(wheelidled, wheelDelay);
	    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

	    function wheelidled() {
	      g.wheel = null;
	      g.end();
	    }
	  }

	  function mousedowned(event, ...args) {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var currentTarget = event.currentTarget,
	        g = gesture(this, args, true).event(event),
	        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
	        p = pointer(event, currentTarget),
	        x0 = event.clientX,
	        y0 = event.clientY;

	    dragDisable(event.view);
	    nopropagation(event);
	    g.mouse = [p, this.__zoom.invert(p)];
	    interrupt(this);
	    g.start();

	    function mousemoved(event) {
	      noevent(event);
	      if (!g.moved) {
	        var dx = event.clientX - x0, dy = event.clientY - y0;
	        g.moved = dx * dx + dy * dy > clickDistance2;
	      }
	      g.event(event)
	       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
	    }

	    function mouseupped(event) {
	      v.on("mousemove.zoom mouseup.zoom", null);
	      yesdrag(event.view, g.moved);
	      noevent(event);
	      g.event(event).end();
	    }
	  }

	  function dblclicked(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var t0 = this.__zoom,
	        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
	        p1 = t0.invert(p0),
	        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
	        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

	    noevent(event);
	    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
	    else select(this).call(zoom.transform, t1, p0, event);
	  }

	  function touchstarted(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var touches = event.touches,
	        n = touches.length,
	        g = gesture(this, args, event.changedTouches.length === n).event(event),
	        started, i, t, p;

	    nopropagation(event);
	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = pointer(t, this);
	      p = [p, this.__zoom.invert(p), t.identifier];
	      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
	      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
	    }

	    if (touchstarting) touchstarting = clearTimeout(touchstarting);

	    if (started) {
	      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
	      interrupt(this);
	      g.start();
	    }
	  }

	  function touchmoved(event, ...args) {
	    if (!this.__zooming) return;
	    var g = gesture(this, args).event(event),
	        touches = event.changedTouches,
	        n = touches.length, i, t, p, l;

	    noevent(event);
	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = pointer(t, this);
	      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
	      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
	    }
	    t = g.that.__zoom;
	    if (g.touch1) {
	      var p0 = g.touch0[0], l0 = g.touch0[1],
	          p1 = g.touch1[0], l1 = g.touch1[1],
	          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
	          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
	      t = scale(t, Math.sqrt(dp / dl));
	      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
	      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
	    }
	    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
	    else return;

	    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
	  }

	  function touchended(event, ...args) {
	    if (!this.__zooming) return;
	    var g = gesture(this, args).event(event),
	        touches = event.changedTouches,
	        n = touches.length, i, t;

	    nopropagation(event);
	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, touchDelay);
	    for (i = 0; i < n; ++i) {
	      t = touches[i];
	      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
	      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
	    }
	    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
	    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
	    else {
	      g.end();
	      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
	      if (g.taps === 2) {
	        t = pointer(t, this);
	        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
	          var p = select(this).on("dblclick.zoom");
	          if (p) p.apply(this, arguments);
	        }
	      }
	    }
	  }

	  zoom.wheelDelta = function(_) {
	    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
	  };

	  zoom.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
	  };

	  zoom.touchable = function(_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
	  };

	  zoom.extent = function(_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
	  };

	  zoom.scaleExtent = function(_) {
	    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
	  };

	  zoom.translateExtent = function(_) {
	    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
	  };

	  zoom.constrain = function(_) {
	    return arguments.length ? (constrain = _, zoom) : constrain;
	  };

	  zoom.duration = function(_) {
	    return arguments.length ? (duration = +_, zoom) : duration;
	  };

	  zoom.interpolate = function(_) {
	    return arguments.length ? (interpolate = _, zoom) : interpolate;
	  };

	  zoom.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? zoom : value;
	  };

	  zoom.clickDistance = function(_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
	  };

	  zoom.tapDistance = function(_) {
	    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
	  };

	  return zoom;
	}

	const errorMessages = {
	    error001: () => '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001',
	    error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
	    error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
	    error004: () => 'The React Flow parent container needs a width and a height to render the graph.',
	    error005: () => 'Only child nodes can use a parent extent.',
	    error006: () => "Can't create edge. An edge needs a source and a target.",
	    error007: (id) => `The old edge with id=${id} does not exist.`,
	    error009: (type) => `Marker type "${type}" doesn't exist.`,
	    error008: (handleType, { id, sourceHandle, targetHandle }) => `Couldn't create edge for ${handleType} handle id: "${handleType === 'source' ? sourceHandle : targetHandle}", edge id: ${id}.`,
	    error010: () => 'Handle: No node id found. Make sure to only use a Handle inside a custom Node.',
	    error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
	    error012: (id) => `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
	    error013: (lib = 'react') => `It seems that you haven't loaded the styles. Please import '@xyflow/${lib}/dist/style.css' or base.css to make sure everything is working properly.`,
	    error014: () => 'useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.',
	    error015: () => 'It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.',
	};
	const infiniteExtent = [
	    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
	    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
	];
	const elementSelectionKeys = ['Enter', ' ', 'Escape'];
	const defaultAriaLabelConfig = {
	    'node.a11yDescription.default': 'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
	    'node.a11yDescription.keyboardDisabled': 'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
	    'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) => `Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
	    'edge.a11yDescription.default': 'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',
	    // Control elements
	    'controls.ariaLabel': 'Control Panel',
	    'controls.zoomIn.ariaLabel': 'Zoom In',
	    'controls.zoomOut.ariaLabel': 'Zoom Out',
	    'controls.fitView.ariaLabel': 'Fit View',
	    'controls.interactive.ariaLabel': 'Toggle Interactivity',
	    // Mini map
	    'minimap.ariaLabel': 'Mini Map',
	    // Handle
	    'handle.ariaLabel': 'Handle',
	};

	/**
	 * The `ConnectionMode` is used to set the mode of connection between nodes.
	 * The `Strict` mode is the default one and only allows source to target edges.
	 * `Loose` mode allows source to source and target to target edges as well.
	 *
	 * @public
	 */
	var ConnectionMode;
	(function (ConnectionMode) {
	    ConnectionMode["Strict"] = "strict";
	    ConnectionMode["Loose"] = "loose";
	})(ConnectionMode || (ConnectionMode = {}));
	/**
	 * This enum is used to set the different modes of panning the viewport when the
	 * user scrolls. The `Free` mode allows the user to pan in any direction by scrolling
	 * with a device like a trackpad. The `Vertical` and `Horizontal` modes restrict
	 * scroll panning to only the vertical or horizontal axis, respectively.
	 *
	 * @public
	 */
	var PanOnScrollMode;
	(function (PanOnScrollMode) {
	    PanOnScrollMode["Free"] = "free";
	    PanOnScrollMode["Vertical"] = "vertical";
	    PanOnScrollMode["Horizontal"] = "horizontal";
	})(PanOnScrollMode || (PanOnScrollMode = {}));
	var SelectionMode;
	(function (SelectionMode) {
	    SelectionMode["Partial"] = "partial";
	    SelectionMode["Full"] = "full";
	})(SelectionMode || (SelectionMode = {}));
	const initialConnection = {
	    inProgress: false,
	    isValid: null,
	    from: null,
	    fromHandle: null,
	    fromPosition: null,
	    fromNode: null,
	    to: null,
	    toHandle: null,
	    toPosition: null,
	    toNode: null,
	    pointer: null,
	};

	/**
	 * If you set the `connectionLineType` prop on your [`<ReactFlow />`](/api-reference/react-flow#connection-connectionLineType)
	 *component, it will dictate the style of connection line rendered when creating
	 *new edges.
	 *
	 * @public
	 *
	 * @remarks If you choose to render a custom connection line component, this value will be
	 *passed to your component as part of its [`ConnectionLineComponentProps`](/api-reference/types/connection-line-component-props).
	 */
	var ConnectionLineType;
	(function (ConnectionLineType) {
	    ConnectionLineType["Bezier"] = "default";
	    ConnectionLineType["Straight"] = "straight";
	    ConnectionLineType["Step"] = "step";
	    ConnectionLineType["SmoothStep"] = "smoothstep";
	    ConnectionLineType["SimpleBezier"] = "simplebezier";
	})(ConnectionLineType || (ConnectionLineType = {}));
	/**
	 * Edges may optionally have a marker on either end. The MarkerType type enumerates
	 * the options available to you when configuring a given marker.
	 *
	 * @public
	 */
	var MarkerType;
	(function (MarkerType) {
	    MarkerType["Arrow"] = "arrow";
	    MarkerType["ArrowClosed"] = "arrowclosed";
	})(MarkerType || (MarkerType = {}));

	/**
	 * While [`PanelPosition`](/api-reference/types/panel-position) can be used to place a
	 * component in the corners of a container, the `Position` enum is less precise and used
	 * primarily in relation to edges and handles.
	 *
	 * @public
	 */
	var Position;
	(function (Position) {
	    Position["Left"] = "left";
	    Position["Top"] = "top";
	    Position["Right"] = "right";
	    Position["Bottom"] = "bottom";
	})(Position || (Position = {}));
	const oppositePosition = {
	    [Position.Left]: Position.Right,
	    [Position.Right]: Position.Left,
	    [Position.Top]: Position.Bottom,
	    [Position.Bottom]: Position.Top,
	};

	/**
	 * @internal
	 */
	function areConnectionMapsEqual(a, b) {
	    if (!a && !b) {
	        return true;
	    }
	    if (!a || !b || a.size !== b.size) {
	        return false;
	    }
	    if (!a.size && !b.size) {
	        return true;
	    }
	    for (const key of a.keys()) {
	        if (!b.has(key)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * We call the callback for all connections in a that are not in b
	 *
	 * @internal
	 */
	function handleConnectionChange(a, b, cb) {
	    if (!cb) {
	        return;
	    }
	    const diff = [];
	    a.forEach((connection, key) => {
	        if (!b?.has(key)) {
	            diff.push(connection);
	        }
	    });
	    if (diff.length) {
	        cb(diff);
	    }
	}
	function getConnectionStatus(isValid) {
	    return isValid === null ? null : isValid ? 'valid' : 'invalid';
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	/**
	 * Test whether an object is usable as an Edge
	 * @public
	 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Edge if it returns true
	 * @param element - The element to test
	 * @returns A boolean indicating whether the element is an Edge
	 */
	const isEdgeBase = (element) => 'id' in element && 'source' in element && 'target' in element;
	/**
	 * Test whether an object is usable as a Node
	 * @public
	 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Node if it returns true
	 * @param element - The element to test
	 * @returns A boolean indicating whether the element is an Node
	 */
	const isNodeBase = (element) => 'id' in element && 'position' in element && !('source' in element) && !('target' in element);
	const isInternalNodeBase = (element) => 'id' in element && 'internals' in element && !('source' in element) && !('target' in element);
	const getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
	    const { width, height } = getNodeDimensions(node);
	    const origin = node.origin ?? nodeOrigin;
	    const offsetX = width * origin[0];
	    const offsetY = height * origin[1];
	    return {
	        x: node.position.x - offsetX,
	        y: node.position.y - offsetY,
	    };
	};
	/**
	 * Returns the bounding box that contains all the given nodes in an array. This can
	 * be useful when combined with [`getViewportForBounds`](/api-reference/utils/get-viewport-for-bounds)
	 * to calculate the correct transform to fit the given nodes in a viewport.
	 * @public
	 * @remarks Useful when combined with {@link getViewportForBounds} to calculate the correct transform to fit the given nodes in a viewport.
	 * @param nodes - Nodes to calculate the bounds for.
	 * @returns Bounding box enclosing all nodes.
	 *
	 * @remarks This function was previously called `getRectOfNodes`
	 *
	 * @example
	 * ```js
	 *import { getNodesBounds } from '@xyflow/react';
	 *
	 *const nodes = [
	 *  {
	 *    id: 'a',
	 *    position: { x: 0, y: 0 },
	 *    data: { label: 'a' },
	 *    width: 50,
	 *    height: 25,
	 *  },
	 *  {
	 *    id: 'b',
	 *    position: { x: 100, y: 100 },
	 *    data: { label: 'b' },
	 *    width: 50,
	 *    height: 25,
	 *  },
	 *];
	 *
	 *const bounds = getNodesBounds(nodes);
	 *```
	 */
	const getNodesBounds = (nodes, params = { nodeOrigin: [0, 0] }) => {
	    if (process.env.NODE_ENV === 'development' && !params.nodeLookup) {
	        console.warn('Please use `getNodesBounds` from `useReactFlow`/`useSvelteFlow` hook to ensure correct values for sub flows. If not possible, you have to provide a nodeLookup to support sub flows.');
	    }
	    if (nodes.length === 0) {
	        return { x: 0, y: 0, width: 0, height: 0 };
	    }
	    const box = nodes.reduce((currBox, nodeOrId) => {
	        const isId = typeof nodeOrId === 'string';
	        let currentNode = !params.nodeLookup && !isId ? nodeOrId : undefined;
	        if (params.nodeLookup) {
	            currentNode = isId
	                ? params.nodeLookup.get(nodeOrId)
	                : !isInternalNodeBase(nodeOrId)
	                    ? params.nodeLookup.get(nodeOrId.id)
	                    : nodeOrId;
	        }
	        const nodeBox = currentNode ? nodeToBox(currentNode, params.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
	        return getBoundsOfBoxes(currBox, nodeBox);
	    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
	    return boxToRect(box);
	};
	/**
	 * Determines a bounding box that contains all given nodes in an array
	 * @internal
	 */
	const getInternalNodesBounds = (nodeLookup, params = {}) => {
	    let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
	    let hasVisibleNodes = false;
	    nodeLookup.forEach((node) => {
	        if (params.filter === undefined || params.filter(node)) {
	            box = getBoundsOfBoxes(box, nodeToBox(node));
	            hasVisibleNodes = true;
	        }
	    });
	    return hasVisibleNodes ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
	};
	const getNodesInside = (nodes, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, 
	// set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
	excludeNonSelectableNodes = false) => {
	    const paneRect = {
	        ...pointToRendererPoint(rect, [tx, ty, tScale]),
	        width: rect.width / tScale,
	        height: rect.height / tScale,
	    };
	    const visibleNodes = [];
	    for (const node of nodes.values()) {
	        const { measured, selectable = true, hidden = false } = node;
	        if ((excludeNonSelectableNodes && !selectable) || hidden) {
	            continue;
	        }
	        const width = measured.width ?? node.width ?? node.initialWidth ?? null;
	        const height = measured.height ?? node.height ?? node.initialHeight ?? null;
	        const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node));
	        const area = (width ?? 0) * (height ?? 0);
	        const partiallyVisible = partially && overlappingArea > 0;
	        const forceInitialRender = !node.internals.handleBounds;
	        const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;
	        if (isVisible || node.dragging) {
	            visibleNodes.push(node);
	        }
	    }
	    return visibleNodes;
	};
	/**
	 * This utility filters an array of edges, keeping only those where either the source or target
	 * node is present in the given array of nodes.
	 * @public
	 * @param nodes - Nodes you want to get the connected edges for.
	 * @param edges - All edges.
	 * @returns Array of edges that connect any of the given nodes with each other.
	 *
	 * @example
	 * ```js
	 *import { getConnectedEdges } from '@xyflow/react';
	 *
	 *const nodes = [
	 *  { id: 'a', position: { x: 0, y: 0 } },
	 *  { id: 'b', position: { x: 100, y: 0 } },
	 *];
	 *
	 *const edges = [
	 *  { id: 'a->c', source: 'a', target: 'c' },
	 *  { id: 'c->d', source: 'c', target: 'd' },
	 *];
	 *
	 *const connectedEdges = getConnectedEdges(nodes, edges);
	 * // => [{ id: 'a->c', source: 'a', target: 'c' }]
	 *```
	 */
	const getConnectedEdges = (nodes, edges) => {
	    const nodeIds = new Set();
	    nodes.forEach((node) => {
	        nodeIds.add(node.id);
	    });
	    return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
	};
	function getFitViewNodes(nodeLookup, options) {
	    const fitViewNodes = new Map();
	    const optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;
	    nodeLookup.forEach((n) => {
	        const isVisible = n.measured.width && n.measured.height && (options?.includeHiddenNodes || !n.hidden);
	        if (isVisible && (!optionNodeIds || optionNodeIds.has(n.id))) {
	            fitViewNodes.set(n.id, n);
	        }
	    });
	    return fitViewNodes;
	}
	async function fitViewport({ nodes, width, height, panZoom, minZoom, maxZoom }, options) {
	    if (nodes.size === 0) {
	        return Promise.resolve(true);
	    }
	    const nodesToFit = getFitViewNodes(nodes, options);
	    const bounds = getInternalNodesBounds(nodesToFit);
	    const viewport = getViewportForBounds(bounds, width, height, options?.minZoom ?? minZoom, options?.maxZoom ?? maxZoom, options?.padding ?? 0.1);
	    await panZoom.setViewport(viewport, {
	        duration: options?.duration,
	        ease: options?.ease,
	        interpolate: options?.interpolate,
	    });
	    return Promise.resolve(true);
	}
	/**
	 * This function calculates the next position of a node, taking into account the node's extent, parent node, and origin.
	 *
	 * @internal
	 * @returns position, positionAbsolute
	 */
	function calculateNodePosition({ nodeId, nextPosition, nodeLookup, nodeOrigin = [0, 0], nodeExtent, onError, }) {
	    const node = nodeLookup.get(nodeId);
	    const parentNode = node.parentId ? nodeLookup.get(node.parentId) : undefined;
	    const { x: parentX, y: parentY } = parentNode ? parentNode.internals.positionAbsolute : { x: 0, y: 0 };
	    const origin = node.origin ?? nodeOrigin;
	    let extent = node.extent || nodeExtent;
	    if (node.extent === 'parent' && !node.expandParent) {
	        if (!parentNode) {
	            onError?.('005', errorMessages['error005']());
	        }
	        else {
	            const parentWidth = parentNode.measured.width;
	            const parentHeight = parentNode.measured.height;
	            if (parentWidth && parentHeight) {
	                extent = [
	                    [parentX, parentY],
	                    [parentX + parentWidth, parentY + parentHeight],
	                ];
	            }
	        }
	    }
	    else if (parentNode && isCoordinateExtent(node.extent)) {
	        extent = [
	            [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
	            [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
	        ];
	    }
	    const positionAbsolute = isCoordinateExtent(extent)
	        ? clampPosition(nextPosition, extent, node.measured)
	        : nextPosition;
	    if (node.measured.width === undefined || node.measured.height === undefined) {
	        onError?.('015', errorMessages['error015']());
	    }
	    return {
	        position: {
	            x: positionAbsolute.x - parentX + (node.measured.width ?? 0) * origin[0],
	            y: positionAbsolute.y - parentY + (node.measured.height ?? 0) * origin[1],
	        },
	        positionAbsolute,
	    };
	}
	/**
	 * Pass in nodes & edges to delete, get arrays of nodes and edges that actually can be deleted
	 * @internal
	 * @param param.nodesToRemove - The nodes to remove
	 * @param param.edgesToRemove - The edges to remove
	 * @param param.nodes - All nodes
	 * @param param.edges - All edges
	 * @param param.onBeforeDelete - Callback to check which nodes and edges can be deleted
	 * @returns nodes: nodes that can be deleted, edges: edges that can be deleted
	 */
	async function getElementsToRemove({ nodesToRemove = [], edgesToRemove = [], nodes, edges, onBeforeDelete, }) {
	    const nodeIds = new Set(nodesToRemove.map((node) => node.id));
	    const matchingNodes = [];
	    for (const node of nodes) {
	        if (node.deletable === false) {
	            continue;
	        }
	        const isIncluded = nodeIds.has(node.id);
	        const parentHit = !isIncluded && node.parentId && matchingNodes.find((n) => n.id === node.parentId);
	        if (isIncluded || parentHit) {
	            matchingNodes.push(node);
	        }
	    }
	    const edgeIds = new Set(edgesToRemove.map((edge) => edge.id));
	    const deletableEdges = edges.filter((edge) => edge.deletable !== false);
	    const connectedEdges = getConnectedEdges(matchingNodes, deletableEdges);
	    const matchingEdges = connectedEdges;
	    for (const edge of deletableEdges) {
	        const isIncluded = edgeIds.has(edge.id);
	        if (isIncluded && !matchingEdges.find((e) => e.id === edge.id)) {
	            matchingEdges.push(edge);
	        }
	    }
	    if (!onBeforeDelete) {
	        return {
	            edges: matchingEdges,
	            nodes: matchingNodes,
	        };
	    }
	    const onBeforeDeleteResult = await onBeforeDelete({
	        nodes: matchingNodes,
	        edges: matchingEdges,
	    });
	    if (typeof onBeforeDeleteResult === 'boolean') {
	        return onBeforeDeleteResult ? { edges: matchingEdges, nodes: matchingNodes } : { edges: [], nodes: [] };
	    }
	    return onBeforeDeleteResult;
	}

	const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
	const clampPosition = (position = { x: 0, y: 0 }, extent, dimensions) => ({
	    x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
	    y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0)),
	});
	function clampPositionToParent(childPosition, childDimensions, parent) {
	    const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
	    const { x: parentX, y: parentY } = parent.internals.positionAbsolute;
	    return clampPosition(childPosition, [
	        [parentX, parentY],
	        [parentX + parentWidth, parentY + parentHeight],
	    ], childDimensions);
	}
	/**
	 * Calculates the velocity of panning when the mouse is close to the edge of the canvas
	 * @internal
	 * @param value - One dimensional poition of the mouse (x or y)
	 * @param min - Minimal position on canvas before panning starts
	 * @param max - Maximal position on canvas before panning starts
	 * @returns - A number between 0 and 1 that represents the velocity of panning
	 */
	const calcAutoPanVelocity = (value, min, max) => {
	    if (value < min) {
	        return clamp(Math.abs(value - min), 1, min) / min;
	    }
	    else if (value > max) {
	        return -clamp(Math.abs(value - max), 1, min) / min;
	    }
	    return 0;
	};
	const calcAutoPan = (pos, bounds, speed = 15, distance = 40) => {
	    const xMovement = calcAutoPanVelocity(pos.x, distance, bounds.width - distance) * speed;
	    const yMovement = calcAutoPanVelocity(pos.y, distance, bounds.height - distance) * speed;
	    return [xMovement, yMovement];
	};
	const getBoundsOfBoxes = (box1, box2) => ({
	    x: Math.min(box1.x, box2.x),
	    y: Math.min(box1.y, box2.y),
	    x2: Math.max(box1.x2, box2.x2),
	    y2: Math.max(box1.y2, box2.y2),
	});
	const rectToBox = ({ x, y, width, height }) => ({
	    x,
	    y,
	    x2: x + width,
	    y2: y + height,
	});
	const boxToRect = ({ x, y, x2, y2 }) => ({
	    x,
	    y,
	    width: x2 - x,
	    height: y2 - y,
	});
	const nodeToRect = (node, nodeOrigin = [0, 0]) => {
	    const { x, y } = isInternalNodeBase(node)
	        ? node.internals.positionAbsolute
	        : getNodePositionWithOrigin(node, nodeOrigin);
	    return {
	        x,
	        y,
	        width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
	        height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0,
	    };
	};
	const nodeToBox = (node, nodeOrigin = [0, 0]) => {
	    const { x, y } = isInternalNodeBase(node)
	        ? node.internals.positionAbsolute
	        : getNodePositionWithOrigin(node, nodeOrigin);
	    return {
	        x,
	        y,
	        x2: x + (node.measured?.width ?? node.width ?? node.initialWidth ?? 0),
	        y2: y + (node.measured?.height ?? node.height ?? node.initialHeight ?? 0),
	    };
	};
	const getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
	const getOverlappingArea = (rectA, rectB) => {
	    const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
	    const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
	    return Math.ceil(xOverlap * yOverlap);
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	const isNumeric = (n) => !isNaN(n) && isFinite(n);
	// used for a11y key board controls for nodes and edges
	const devWarn = (id, message) => {
	    if (process.env.NODE_ENV === 'development') {
	        console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
	    }
	};
	const snapPosition = (position, snapGrid = [1, 1]) => {
	    return {
	        x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
	        y: snapGrid[1] * Math.round(position.y / snapGrid[1]),
	    };
	};
	const pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) => {
	    const position = {
	        x: (x - tx) / tScale,
	        y: (y - ty) / tScale,
	    };
	    return snapToGrid ? snapPosition(position, snapGrid) : position;
	};
	const rendererPointToPoint = ({ x, y }, [tx, ty, tScale]) => {
	    return {
	        x: x * tScale + tx,
	        y: y * tScale + ty,
	    };
	};
	/**
	 * Parses a single padding value to a number
	 * @internal
	 * @param padding - Padding to parse
	 * @param viewport - Width or height of the viewport
	 * @returns The padding in pixels
	 */
	function parsePadding(padding, viewport) {
	    if (typeof padding === 'number') {
	        return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
	    }
	    if (typeof padding === 'string' && padding.endsWith('px')) {
	        const paddingValue = parseFloat(padding);
	        if (!Number.isNaN(paddingValue)) {
	            return Math.floor(paddingValue);
	        }
	    }
	    if (typeof padding === 'string' && padding.endsWith('%')) {
	        const paddingValue = parseFloat(padding);
	        if (!Number.isNaN(paddingValue)) {
	            return Math.floor(viewport * paddingValue * 0.01);
	        }
	    }
	    console.error(`[React Flow] The padding value "${padding}" is invalid. Please provide a number or a string with a valid unit (px or %).`);
	    return 0;
	}
	/**
	 * Parses the paddings to an object with top, right, bottom, left, x and y paddings
	 * @internal
	 * @param padding - Padding to parse
	 * @param width - Width of the viewport
	 * @param height - Height of the viewport
	 * @returns An object with the paddings in pixels
	 */
	function parsePaddings(padding, width, height) {
	    if (typeof padding === 'string' || typeof padding === 'number') {
	        const paddingY = parsePadding(padding, height);
	        const paddingX = parsePadding(padding, width);
	        return {
	            top: paddingY,
	            right: paddingX,
	            bottom: paddingY,
	            left: paddingX,
	            x: paddingX * 2,
	            y: paddingY * 2,
	        };
	    }
	    if (typeof padding === 'object') {
	        const top = parsePadding(padding.top ?? padding.y ?? 0, height);
	        const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
	        const left = parsePadding(padding.left ?? padding.x ?? 0, width);
	        const right = parsePadding(padding.right ?? padding.x ?? 0, width);
	        return { top, right, bottom, left, x: left + right, y: top + bottom };
	    }
	    return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
	}
	/**
	 * Calculates the resulting paddings if the new viewport is applied
	 * @internal
	 * @param bounds - Bounds to fit inside viewport
	 * @param x - X position of the viewport
	 * @param y - Y position of the viewport
	 * @param zoom - Zoom level of the viewport
	 * @param width - Width of the viewport
	 * @param height - Height of the viewport
	 * @returns An object with the minimum padding required to fit the bounds inside the viewport
	 */
	function calculateAppliedPaddings(bounds, x, y, zoom, width, height) {
	    const { x: left, y: top } = rendererPointToPoint(bounds, [x, y, zoom]);
	    const { x: boundRight, y: boundBottom } = rendererPointToPoint({ x: bounds.x + bounds.width, y: bounds.y + bounds.height }, [x, y, zoom]);
	    const right = width - boundRight;
	    const bottom = height - boundBottom;
	    return {
	        left: Math.floor(left),
	        top: Math.floor(top),
	        right: Math.floor(right),
	        bottom: Math.floor(bottom),
	    };
	}
	/**
	 * Returns a viewport that encloses the given bounds with padding.
	 * @public
	 * @remarks You can determine bounds of nodes with {@link getNodesBounds} and {@link getBoundsOfRects}
	 * @param bounds - Bounds to fit inside viewport.
	 * @param width - Width of the viewport.
	 * @param height  - Height of the viewport.
	 * @param minZoom - Minimum zoom level of the resulting viewport.
	 * @param maxZoom - Maximum zoom level of the resulting viewport.
	 * @param padding - Padding around the bounds.
	 * @returns A transformed {@link Viewport} that encloses the given bounds which you can pass to e.g. {@link setViewport}.
	 * @example
	 * const { x, y, zoom } = getViewportForBounds(
	 * { x: 0, y: 0, width: 100, height: 100},
	 * 1200, 800, 0.5, 2);
	 */
	const getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding) => {
	    // First we resolve all the paddings to actual pixel values
	    const p = parsePaddings(padding, width, height);
	    const xZoom = (width - p.x) / bounds.width;
	    const yZoom = (height - p.y) / bounds.height;
	    // We calculate the new x, y, zoom for a centered view
	    const zoom = Math.min(xZoom, yZoom);
	    const clampedZoom = clamp(zoom, minZoom, maxZoom);
	    const boundsCenterX = bounds.x + bounds.width / 2;
	    const boundsCenterY = bounds.y + bounds.height / 2;
	    const x = width / 2 - boundsCenterX * clampedZoom;
	    const y = height / 2 - boundsCenterY * clampedZoom;
	    // Then we calculate the minimum padding, to respect asymmetric paddings
	    const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);
	    // We only want to have an offset if the newPadding is smaller than the required padding
	    const offset = {
	        left: Math.min(newPadding.left - p.left, 0),
	        top: Math.min(newPadding.top - p.top, 0),
	        right: Math.min(newPadding.right - p.right, 0),
	        bottom: Math.min(newPadding.bottom - p.bottom, 0),
	    };
	    return {
	        x: x - offset.left + offset.right,
	        y: y - offset.top + offset.bottom,
	        zoom: clampedZoom,
	    };
	};
	const isMacOs = () => typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Mac') >= 0;
	function isCoordinateExtent(extent) {
	    return extent !== undefined && extent !== null && extent !== 'parent';
	}
	function getNodeDimensions(node) {
	    return {
	        width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
	        height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0,
	    };
	}
	function nodeHasDimensions(node) {
	    return ((node.measured?.width ?? node.width ?? node.initialWidth) !== undefined &&
	        (node.measured?.height ?? node.height ?? node.initialHeight) !== undefined);
	}
	/**
	 * Convert child position to aboslute position
	 *
	 * @internal
	 * @param position
	 * @param parentId
	 * @param nodeLookup
	 * @param nodeOrigin
	 * @returns an internal node with an absolute position
	 */
	function evaluateAbsolutePosition(position, dimensions = { width: 0, height: 0 }, parentId, nodeLookup, nodeOrigin) {
	    const positionAbsolute = { ...position };
	    const parent = nodeLookup.get(parentId);
	    if (parent) {
	        const origin = parent.origin || nodeOrigin;
	        positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
	        positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
	    }
	    return positionAbsolute;
	}
	function mergeAriaLabelConfig(partial) {
	    return { ...defaultAriaLabelConfig, ...(partial || {}) };
	}

	function getPointerPosition(event, { snapGrid = [0, 0], snapToGrid = false, transform, containerBounds }) {
	    const { x, y } = getEventPosition(event);
	    const pointerPos = pointToRendererPoint({ x: x - (containerBounds?.left ?? 0), y: y - (containerBounds?.top ?? 0) }, transform);
	    const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;
	    // we need the snapped position in order to be able to skip unnecessary drag events
	    return {
	        xSnapped,
	        ySnapped,
	        ...pointerPos,
	    };
	}
	const getDimensions = (node) => ({
	    width: node.offsetWidth,
	    height: node.offsetHeight,
	});
	const getHostForElement = (element) => element?.getRootNode?.() || window?.document;
	const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];
	function isInputDOMNode(event) {
	    // using composed path for handling shadow dom
	    const target = (event.composedPath?.()?.[0] || event.target);
	    if (target?.nodeType !== 1 /* Node.ELEMENT_NODE */)
	        return false;
	    const isInput = inputTags.includes(target.nodeName) || target.hasAttribute('contenteditable');
	    // when an input field is focused we don't want to trigger deletion or movement of nodes
	    return isInput || !!target.closest('.nokey');
	}
	const isMouseEvent = (event) => 'clientX' in event;
	const getEventPosition = (event, bounds) => {
	    const isMouse = isMouseEvent(event);
	    const evtX = isMouse ? event.clientX : event.touches?.[0].clientX;
	    const evtY = isMouse ? event.clientY : event.touches?.[0].clientY;
	    return {
	        x: evtX - (bounds?.left ?? 0),
	        y: evtY - (bounds?.top ?? 0),
	    };
	};
	/*
	 * The handle bounds are calculated relative to the node element.
	 * We store them in the internals object of the node in order to avoid
	 * unnecessary recalculations.
	 */
	const getHandleBounds = (type, nodeElement, nodeBounds, zoom, nodeId) => {
	    const handles = nodeElement.querySelectorAll(`.${type}`);
	    if (!handles || !handles.length) {
	        return null;
	    }
	    return Array.from(handles).map((handle) => {
	        const handleBounds = handle.getBoundingClientRect();
	        return {
	            id: handle.getAttribute('data-handleid'),
	            type,
	            nodeId,
	            position: handle.getAttribute('data-handlepos'),
	            x: (handleBounds.left - nodeBounds.left) / zoom,
	            y: (handleBounds.top - nodeBounds.top) / zoom,
	            ...getDimensions(handle),
	        };
	    });
	};

	function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY, }) {
	    /*
	     * cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
	     * https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
	     */
	    const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
	    const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
	    const offsetX = Math.abs(centerX - sourceX);
	    const offsetY = Math.abs(centerY - sourceY);
	    return [centerX, centerY, offsetX, offsetY];
	}
	function calculateControlOffset(distance, curvature) {
	    if (distance >= 0) {
	        return 0.5 * distance;
	    }
	    return curvature * 25 * Math.sqrt(-distance);
	}
	function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
	    switch (pos) {
	        case Position.Left:
	            return [x1 - calculateControlOffset(x1 - x2, c), y1];
	        case Position.Right:
	            return [x1 + calculateControlOffset(x2 - x1, c), y1];
	        case Position.Top:
	            return [x1, y1 - calculateControlOffset(y1 - y2, c)];
	        case Position.Bottom:
	            return [x1, y1 + calculateControlOffset(y2 - y1, c)];
	    }
	}
	/**
	 * The `getBezierPath` util returns everything you need to render a bezier edge
	 *between two nodes.
	 * @public
	 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
	 * and `offsetX`, `offsetY` between source handle and label.
	 * - `path`: the path to use in an SVG `<path>` element.
	 * - `labelX`: the `x` position you can use to render a label for this edge.
	 * - `labelY`: the `y` position you can use to render a label for this edge.
	 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
	 * middle of this path.
	 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
	 * middle of this path.
	 * @example
	 * ```js
	 *  const source = { x: 0, y: 20 };
	 *  const target = { x: 150, y: 100 };
	 *
	 *  const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({
	 *    sourceX: source.x,
	 *    sourceY: source.y,
	 *    sourcePosition: Position.Right,
	 *    targetX: target.x,
	 *    targetY: target.y,
	 *    targetPosition: Position.Left,
	 *});
	 *```
	 *
	 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to
	 *work with multiple edge paths at once.
	 */
	function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25, }) {
	    const [sourceControlX, sourceControlY] = getControlWithCurvature({
	        pos: sourcePosition,
	        x1: sourceX,
	        y1: sourceY,
	        x2: targetX,
	        y2: targetY,
	        c: curvature,
	    });
	    const [targetControlX, targetControlY] = getControlWithCurvature({
	        pos: targetPosition,
	        x1: targetX,
	        y1: targetY,
	        x2: sourceX,
	        y2: sourceY,
	        c: curvature,
	    });
	    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
	        sourceX,
	        sourceY,
	        targetX,
	        targetY,
	        sourceControlX,
	        sourceControlY,
	        targetControlX,
	        targetControlY,
	    });
	    return [
	        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
	        labelX,
	        labelY,
	        offsetX,
	        offsetY,
	    ];
	}

	// this is used for straight edges and simple smoothstep edges (LTR, RTL, BTT, TTB)
	function getEdgeCenter({ sourceX, sourceY, targetX, targetY, }) {
	    const xOffset = Math.abs(targetX - sourceX) / 2;
	    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
	    const yOffset = Math.abs(targetY - sourceY) / 2;
	    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
	    return [centerX, centerY, xOffset, yOffset];
	}
	/**
	 * Returns the z-index for an edge based on the node it connects and whether it is selected.
	 * By default, edges are rendered below nodes. This behaviour is different for edges that are
	 * connected to nodes with a parent, as they are rendered above the parent node.
	 */
	function getElevatedEdgeZIndex({ sourceNode, targetNode, selected = false, zIndex = 0, elevateOnSelect = false, zIndexMode = 'basic', }) {
	    if (zIndexMode === 'manual') {
	        return zIndex;
	    }
	    const edgeZ = elevateOnSelect && selected ? zIndex + 1000 : zIndex;
	    const nodeZ = Math.max(sourceNode.parentId || (elevateOnSelect && sourceNode.selected) ? sourceNode.internals.z : 0, targetNode.parentId || (elevateOnSelect && targetNode.selected) ? targetNode.internals.z : 0);
	    return edgeZ + nodeZ;
	}
	function isEdgeVisible({ sourceNode, targetNode, width, height, transform }) {
	    const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));
	    if (edgeBox.x === edgeBox.x2) {
	        edgeBox.x2 += 1;
	    }
	    if (edgeBox.y === edgeBox.y2) {
	        edgeBox.y2 += 1;
	    }
	    const viewRect = {
	        x: -transform[0] / transform[2],
	        y: -transform[1] / transform[2],
	        width: width / transform[2],
	        height: height / transform[2],
	    };
	    return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
	}
	/**
	 * The default edge ID generator function. Generates an ID based on the source, target, and handles.
	 * @public
	 * @param params - The connection or edge to generate an ID for.
	 * @returns The generated edge ID.
	 */
	const getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `xy-edge__${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
	const connectionExists = (edge, edges) => {
	    return edges.some((el) => el.source === edge.source &&
	        el.target === edge.target &&
	        (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
	        (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle)));
	};
	/**
	 * This util is a convenience function to add a new Edge to an array of edges. It also performs some validation to make sure you don't add an invalid edge or duplicate an existing one.
	 * @public
	 * @param edgeParams - Either an `Edge` or a `Connection` you want to add.
	 * @param edges - The array of all current edges.
	 * @param options - Optional configuration object.
	 * @returns A new array of edges with the new edge added.
	 *
	 * @remarks If an edge with the same `target` and `source` already exists (and the same
	 *`targetHandle` and `sourceHandle` if those are set), then this util won't add
	 *a new edge even if the `id` property is different.
	 *
	 */
	const addEdge = (edgeParams, edges, options = {}) => {
	    if (!edgeParams.source || !edgeParams.target) {
	        devWarn('006', errorMessages['error006']());
	        return edges;
	    }
	    const edgeIdGenerator = options.getEdgeId || getEdgeId;
	    let edge;
	    if (isEdgeBase(edgeParams)) {
	        edge = { ...edgeParams };
	    }
	    else {
	        edge = {
	            ...edgeParams,
	            id: edgeIdGenerator(edgeParams),
	        };
	    }
	    if (connectionExists(edge, edges)) {
	        return edges;
	    }
	    if (edge.sourceHandle === null) {
	        delete edge.sourceHandle;
	    }
	    if (edge.targetHandle === null) {
	        delete edge.targetHandle;
	    }
	    return edges.concat(edge);
	};

	/**
	 * Calculates the straight line path between two points.
	 * @public
	 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
	 * and `offsetX`, `offsetY` between source handle and label.
	 *
	 * - `path`: the path to use in an SVG `<path>` element.
	 * - `labelX`: the `x` position you can use to render a label for this edge.
	 * - `labelY`: the `y` position you can use to render a label for this edge.
	 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
	 * middle of this path.
	 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
	 * middle of this path.
	 * @example
	 * ```js
	 *  const source = { x: 0, y: 20 };
	 *  const target = { x: 150, y: 100 };
	 *
	 *  const [path, labelX, labelY, offsetX, offsetY] = getStraightPath({
	 *    sourceX: source.x,
	 *    sourceY: source.y,
	 *    sourcePosition: Position.Right,
	 *    targetX: target.x,
	 *    targetY: target.y,
	 *    targetPosition: Position.Left,
	 *  });
	 * ```
	 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to work with multiple edge paths at once.
	 */
	function getStraightPath({ sourceX, sourceY, targetX, targetY, }) {
	    const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
	        sourceX,
	        sourceY,
	        targetX,
	        targetY,
	    });
	    return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
	}

	const handleDirections = {
	    [Position.Left]: { x: -1, y: 0 },
	    [Position.Right]: { x: 1, y: 0 },
	    [Position.Top]: { x: 0, y: -1 },
	    [Position.Bottom]: { x: 0, y: 1 },
	};
	const getDirection = ({ source, sourcePosition = Position.Bottom, target, }) => {
	    if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
	        return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
	    }
	    return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
	};
	const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
	/*
	 * With this function we try to mimic an orthogonal edge routing behaviour
	 * It's not as good as a real orthogonal edge routing, but it's faster and good enough as a default for step and smooth step edges
	 */
	function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset, stepPosition, }) {
	    const sourceDir = handleDirections[sourcePosition];
	    const targetDir = handleDirections[targetPosition];
	    const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
	    const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
	    const dir = getDirection({
	        source: sourceGapped,
	        sourcePosition,
	        target: targetGapped,
	    });
	    const dirAccessor = dir.x !== 0 ? 'x' : 'y';
	    const currDir = dir[dirAccessor];
	    let points = [];
	    let centerX, centerY;
	    const sourceGapOffset = { x: 0, y: 0 };
	    const targetGapOffset = { x: 0, y: 0 };
	    const [, , defaultOffsetX, defaultOffsetY] = getEdgeCenter({
	        sourceX: source.x,
	        sourceY: source.y,
	        targetX: target.x,
	        targetY: target.y,
	    });
	    // opposite handle positions, default case
	    if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
	        if (dirAccessor === 'x') {
	            // Primary direction is horizontal, so stepPosition affects X coordinate
	            centerX = center.x ?? (sourceGapped.x + (targetGapped.x - sourceGapped.x) * stepPosition);
	            centerY = center.y ?? (sourceGapped.y + targetGapped.y) / 2;
	        }
	        else {
	            // Primary direction is vertical, so stepPosition affects Y coordinate  
	            centerX = center.x ?? (sourceGapped.x + targetGapped.x) / 2;
	            centerY = center.y ?? (sourceGapped.y + (targetGapped.y - sourceGapped.y) * stepPosition);
	        }
	        /*
	         *    --->
	         *    |
	         * >---
	         */
	        const verticalSplit = [
	            { x: centerX, y: sourceGapped.y },
	            { x: centerX, y: targetGapped.y },
	        ];
	        /*
	         *    |
	         *  ---
	         *  |
	         */
	        const horizontalSplit = [
	            { x: sourceGapped.x, y: centerY },
	            { x: targetGapped.x, y: centerY },
	        ];
	        if (sourceDir[dirAccessor] === currDir) {
	            points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
	        }
	        else {
	            points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
	        }
	    }
	    else {
	        // sourceTarget means we take x from source and y from target, targetSource is the opposite
	        const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
	        const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
	        // this handles edges with same handle positions
	        if (dirAccessor === 'x') {
	            points = sourceDir.x === currDir ? targetSource : sourceTarget;
	        }
	        else {
	            points = sourceDir.y === currDir ? sourceTarget : targetSource;
	        }
	        if (sourcePosition === targetPosition) {
	            const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
	            // if an edge goes from right to right for example (sourcePosition === targetPosition) and the distance between source.x and target.x is less than the offset, the added point and the gapped source/target will overlap. This leads to a weird edge path. To avoid this we add a gapOffset to the source/target
	            if (diff <= offset) {
	                const gapOffset = Math.min(offset - 1, offset - diff);
	                if (sourceDir[dirAccessor] === currDir) {
	                    sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
	                }
	                else {
	                    targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
	                }
	            }
	        }
	        // these are conditions for handling mixed handle positions like Right -> Bottom for example
	        if (sourcePosition !== targetPosition) {
	            const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
	            const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
	            const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
	            const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
	            const flipSourceTarget = (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
	                (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));
	            if (flipSourceTarget) {
	                points = dirAccessor === 'x' ? sourceTarget : targetSource;
	            }
	        }
	        const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
	        const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
	        const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
	        const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
	        // we want to place the label on the longest segment of the edge
	        if (maxXDistance >= maxYDistance) {
	            centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
	            centerY = points[0].y;
	        }
	        else {
	            centerX = points[0].x;
	            centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
	        }
	    }
	    const pathPoints = [
	        source,
	        { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
	        ...points,
	        { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
	        target,
	    ];
	    return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
	}
	function getBend(a, b, c, size) {
	    const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
	    const { x, y } = b;
	    // no bend
	    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
	        return `L${x} ${y}`;
	    }
	    // first segment is horizontal
	    if (a.y === y) {
	        const xDir = a.x < c.x ? -1 : 1;
	        const yDir = a.y < c.y ? 1 : -1;
	        return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
	    }
	    const xDir = a.x < c.x ? 1 : -1;
	    const yDir = a.y < c.y ? -1 : 1;
	    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
	}
	/**
	 * The `getSmoothStepPath` util returns everything you need to render a stepped path
	 * between two nodes. The `borderRadius` property can be used to choose how rounded
	 * the corners of those steps are.
	 * @public
	 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
	 * and `offsetX`, `offsetY` between source handle and label.
	 *
	 * - `path`: the path to use in an SVG `<path>` element.
	 * - `labelX`: the `x` position you can use to render a label for this edge.
	 * - `labelY`: the `y` position you can use to render a label for this edge.
	 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
	 * middle of this path.
	 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
	 * middle of this path.
	 * @example
	 * ```js
	 *  const source = { x: 0, y: 20 };
	 *  const target = { x: 150, y: 100 };
	 *
	 *  const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
	 *    sourceX: source.x,
	 *    sourceY: source.y,
	 *    sourcePosition: Position.Right,
	 *    targetX: target.x,
	 *    targetY: target.y,
	 *    targetPosition: Position.Left,
	 *  });
	 * ```
	 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to work with multiple edge paths at once.
	 */
	function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20, stepPosition = 0.5, }) {
	    const [points, labelX, labelY, offsetX, offsetY] = getPoints({
	        source: { x: sourceX, y: sourceY },
	        sourcePosition,
	        target: { x: targetX, y: targetY },
	        targetPosition,
	        center: { x: centerX, y: centerY },
	        offset,
	        stepPosition,
	    });
	    const path = points.reduce((res, p, i) => {
	        let segment = '';
	        if (i > 0 && i < points.length - 1) {
	            segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
	        }
	        else {
	            segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
	        }
	        res += segment;
	        return res;
	    }, '');
	    return [path, labelX, labelY, offsetX, offsetY];
	}

	function isNodeInitialized(node) {
	    return (node &&
	        !!(node.internals.handleBounds || node.handles?.length) &&
	        !!(node.measured.width || node.width || node.initialWidth));
	}
	function getEdgePosition(params) {
	    const { sourceNode, targetNode } = params;
	    if (!isNodeInitialized(sourceNode) || !isNodeInitialized(targetNode)) {
	        return null;
	    }
	    const sourceHandleBounds = sourceNode.internals.handleBounds || toHandleBounds(sourceNode.handles);
	    const targetHandleBounds = targetNode.internals.handleBounds || toHandleBounds(targetNode.handles);
	    const sourceHandle = getHandle$1(sourceHandleBounds?.source ?? [], params.sourceHandle);
	    const targetHandle = getHandle$1(
	    // when connection type is loose we can define all handles as sources and connect source -> source
	    params.connectionMode === ConnectionMode.Strict
	        ? targetHandleBounds?.target ?? []
	        : (targetHandleBounds?.target ?? []).concat(targetHandleBounds?.source ?? []), params.targetHandle);
	    if (!sourceHandle || !targetHandle) {
	        params.onError?.('008', errorMessages['error008'](!sourceHandle ? 'source' : 'target', {
	            id: params.id,
	            sourceHandle: params.sourceHandle,
	            targetHandle: params.targetHandle,
	        }));
	        return null;
	    }
	    const sourcePosition = sourceHandle?.position || Position.Bottom;
	    const targetPosition = targetHandle?.position || Position.Top;
	    const source = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
	    const target = getHandlePosition(targetNode, targetHandle, targetPosition);
	    return {
	        sourceX: source.x,
	        sourceY: source.y,
	        targetX: target.x,
	        targetY: target.y,
	        sourcePosition,
	        targetPosition,
	    };
	}
	function toHandleBounds(handles) {
	    if (!handles) {
	        return null;
	    }
	    const source = [];
	    const target = [];
	    for (const handle of handles) {
	        handle.width = handle.width ?? 1;
	        handle.height = handle.height ?? 1;
	        if (handle.type === 'source') {
	            source.push(handle);
	        }
	        else if (handle.type === 'target') {
	            target.push(handle);
	        }
	    }
	    return {
	        source,
	        target,
	    };
	}
	function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
	    const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
	    const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
	    const { width, height } = handle ?? getNodeDimensions(node);
	    if (center) {
	        return { x: x + width / 2, y: y + height / 2 };
	    }
	    const position = handle?.position ?? fallbackPosition;
	    switch (position) {
	        case Position.Top:
	            return { x: x + width / 2, y };
	        case Position.Right:
	            return { x: x + width, y: y + height / 2 };
	        case Position.Bottom:
	            return { x: x + width / 2, y: y + height };
	        case Position.Left:
	            return { x, y: y + height / 2 };
	    }
	}
	function getHandle$1(bounds, handleId) {
	    if (!bounds) {
	        return null;
	    }
	    // if no handleId is given, we use the first handle, otherwise we check for the id
	    return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
	}

	function getMarkerId(marker, id) {
	    if (!marker) {
	        return '';
	    }
	    if (typeof marker === 'string') {
	        return marker;
	    }
	    const idPrefix = id ? `${id}__` : '';
	    return `${idPrefix}${Object.keys(marker)
        .sort()
        .map((key) => `${key}=${marker[key]}`)
        .join('&')}`;
	}
	function createMarkerIds(edges, { id, defaultColor, defaultMarkerStart, defaultMarkerEnd, }) {
	    const ids = new Set();
	    return edges
	        .reduce((markers, edge) => {
	        [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
	            if (marker && typeof marker === 'object') {
	                const markerId = getMarkerId(marker, id);
	                if (!ids.has(markerId)) {
	                    markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
	                    ids.add(markerId);
	                }
	            }
	        });
	        return markers;
	    }, [])
	        .sort((a, b) => a.id.localeCompare(b.id));
	}

	const SELECTED_NODE_Z = 1000;
	const ROOT_PARENT_Z_INCREMENT = 10;
	const defaultOptions = {
	    nodeOrigin: [0, 0],
	    nodeExtent: infiniteExtent,
	    elevateNodesOnSelect: true,
	    zIndexMode: 'basic',
	    defaults: {},
	};
	const adoptUserNodesDefaultOptions = {
	    ...defaultOptions,
	    checkEquality: true,
	};
	function mergeObjects(base, incoming) {
	    const result = { ...base };
	    for (const key in incoming) {
	        if (incoming[key] !== undefined) {
	            // typecast is safe here, because we check for undefined
	            result[key] = incoming[key];
	        }
	    }
	    return result;
	}
	function updateAbsolutePositions(nodeLookup, parentLookup, options) {
	    const _options = mergeObjects(defaultOptions, options);
	    for (const node of nodeLookup.values()) {
	        if (node.parentId) {
	            updateChildNode(node, nodeLookup, parentLookup, _options);
	        }
	        else {
	            const positionWithOrigin = getNodePositionWithOrigin(node, _options.nodeOrigin);
	            const extent = isCoordinateExtent(node.extent) ? node.extent : _options.nodeExtent;
	            const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
	            node.internals.positionAbsolute = clampedPosition;
	        }
	    }
	}
	function parseHandles(userNode, internalNode) {
	    if (!userNode.handles) {
	        return !userNode.measured ? undefined : internalNode?.internals.handleBounds;
	    }
	    const source = [];
	    const target = [];
	    for (const handle of userNode.handles) {
	        const handleBounds = {
	            id: handle.id,
	            width: handle.width ?? 1,
	            height: handle.height ?? 1,
	            nodeId: userNode.id,
	            x: handle.x,
	            y: handle.y,
	            position: handle.position,
	            type: handle.type,
	        };
	        if (handle.type === 'source') {
	            source.push(handleBounds);
	        }
	        else if (handle.type === 'target') {
	            target.push(handleBounds);
	        }
	    }
	    return {
	        source,
	        target,
	    };
	}
	function isManualZIndexMode(zIndexMode) {
	    return zIndexMode === 'manual';
	}
	function adoptUserNodes(nodes, nodeLookup, parentLookup, options = {}) {
	    const _options = mergeObjects(adoptUserNodesDefaultOptions, options);
	    const rootParentIndex = { i: 0 };
	    const tmpLookup = new Map(nodeLookup);
	    const selectedNodeZ = _options?.elevateNodesOnSelect && !isManualZIndexMode(_options.zIndexMode) ? SELECTED_NODE_Z : 0;
	    let nodesInitialized = nodes.length > 0;
	    nodeLookup.clear();
	    parentLookup.clear();
	    for (const userNode of nodes) {
	        let internalNode = tmpLookup.get(userNode.id);
	        if (_options.checkEquality && userNode === internalNode?.internals.userNode) {
	            nodeLookup.set(userNode.id, internalNode);
	        }
	        else {
	            const positionWithOrigin = getNodePositionWithOrigin(userNode, _options.nodeOrigin);
	            const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : _options.nodeExtent;
	            const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));
	            internalNode = {
	                ..._options.defaults,
	                ...userNode,
	                measured: {
	                    width: userNode.measured?.width,
	                    height: userNode.measured?.height,
	                },
	                internals: {
	                    positionAbsolute: clampedPosition,
	                    // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
	                    handleBounds: parseHandles(userNode, internalNode),
	                    z: calculateZ(userNode, selectedNodeZ, _options.zIndexMode),
	                    userNode,
	                },
	            };
	            nodeLookup.set(userNode.id, internalNode);
	        }
	        if ((internalNode.measured === undefined ||
	            internalNode.measured.width === undefined ||
	            internalNode.measured.height === undefined) &&
	            !internalNode.hidden) {
	            nodesInitialized = false;
	        }
	        if (userNode.parentId) {
	            updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex);
	        }
	    }
	    return nodesInitialized;
	}
	function updateParentLookup(node, parentLookup) {
	    if (!node.parentId) {
	        return;
	    }
	    const childNodes = parentLookup.get(node.parentId);
	    if (childNodes) {
	        childNodes.set(node.id, node);
	    }
	    else {
	        parentLookup.set(node.parentId, new Map([[node.id, node]]));
	    }
	}
	/**
	 * Updates positionAbsolute and zIndex of a child node and the parentLookup.
	 */
	function updateChildNode(node, nodeLookup, parentLookup, options, rootParentIndex) {
	    const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = mergeObjects(defaultOptions, options);
	    const parentId = node.parentId;
	    const parentNode = nodeLookup.get(parentId);
	    if (!parentNode) {
	        console.warn(`Parent node ${parentId} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
	        return;
	    }
	    updateParentLookup(node, parentLookup);
	    // We just want to set the rootParentIndex for the first child
	    if (rootParentIndex &&
	        !parentNode.parentId &&
	        parentNode.internals.rootParentIndex === undefined &&
	        zIndexMode === 'auto') {
	        parentNode.internals.rootParentIndex = ++rootParentIndex.i;
	        parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
	    }
	    // But we need to update rootParentIndex.i also when parent has not been updated
	    if (rootParentIndex && parentNode.internals.rootParentIndex !== undefined) {
	        rootParentIndex.i = parentNode.internals.rootParentIndex;
	    }
	    const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
	    const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
	    const { positionAbsolute } = node.internals;
	    const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;
	    if (positionChanged || z !== node.internals.z) {
	        // we create a new object to mark the node as updated
	        nodeLookup.set(node.id, {
	            ...node,
	            internals: {
	                ...node.internals,
	                positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
	                z,
	            },
	        });
	    }
	}
	function calculateZ(node, selectedNodeZ, zIndexMode) {
	    const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;
	    if (isManualZIndexMode(zIndexMode)) {
	        return zIndex;
	    }
	    return zIndex + (node.selected ? selectedNodeZ : 0);
	}
	function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode) {
	    const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
	    const childDimensions = getNodeDimensions(childNode);
	    const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
	    const clampedPosition = isCoordinateExtent(childNode.extent)
	        ? clampPosition(positionWithOrigin, childNode.extent, childDimensions)
	        : positionWithOrigin;
	    let absolutePosition = clampPosition({ x: parentX + clampedPosition.x, y: parentY + clampedPosition.y }, nodeExtent, childDimensions);
	    if (childNode.extent === 'parent') {
	        absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
	    }
	    const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
	    const parentZ = parentNode.internals.z ?? 0;
	    return {
	        x: absolutePosition.x,
	        y: absolutePosition.y,
	        z: parentZ >= childZ ? parentZ + 1 : childZ,
	    };
	}
	function handleExpandParent(children, nodeLookup, parentLookup, nodeOrigin = [0, 0]) {
	    const changes = [];
	    const parentExpansions = new Map();
	    // determine the expanded rectangle the child nodes would take for each parent
	    for (const child of children) {
	        const parent = nodeLookup.get(child.parentId);
	        if (!parent) {
	            continue;
	        }
	        const parentRect = parentExpansions.get(child.parentId)?.expandedRect ?? nodeToRect(parent);
	        const expandedRect = getBoundsOfRects(parentRect, child.rect);
	        parentExpansions.set(child.parentId, { expandedRect, parent });
	    }
	    if (parentExpansions.size > 0) {
	        parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
	            // determine the position & dimensions of the parent
	            const positionAbsolute = parent.internals.positionAbsolute;
	            const dimensions = getNodeDimensions(parent);
	            const origin = parent.origin ?? nodeOrigin;
	            // determine how much the parent expands in width and position
	            const xChange = expandedRect.x < positionAbsolute.x ? Math.round(Math.abs(positionAbsolute.x - expandedRect.x)) : 0;
	            const yChange = expandedRect.y < positionAbsolute.y ? Math.round(Math.abs(positionAbsolute.y - expandedRect.y)) : 0;
	            const newWidth = Math.max(dimensions.width, Math.round(expandedRect.width));
	            const newHeight = Math.max(dimensions.height, Math.round(expandedRect.height));
	            const widthChange = (newWidth - dimensions.width) * origin[0];
	            const heightChange = (newHeight - dimensions.height) * origin[1];
	            // We need to correct the position of the parent node if the origin is not [0,0]
	            if (xChange > 0 || yChange > 0 || widthChange || heightChange) {
	                changes.push({
	                    id: parentId,
	                    type: 'position',
	                    position: {
	                        x: parent.position.x - xChange + widthChange,
	                        y: parent.position.y - yChange + heightChange,
	                    },
	                });
	                /*
	                 * We move all child nodes in the oppsite direction
	                 * so the x,y changes of the parent do not move the children
	                 */
	                parentLookup.get(parentId)?.forEach((childNode) => {
	                    if (!children.some((child) => child.id === childNode.id)) {
	                        changes.push({
	                            id: childNode.id,
	                            type: 'position',
	                            position: {
	                                x: childNode.position.x + xChange,
	                                y: childNode.position.y + yChange,
	                            },
	                        });
	                    }
	                });
	            }
	            // We need to correct the dimensions of the parent node if the origin is not [0,0]
	            if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height || xChange || yChange) {
	                changes.push({
	                    id: parentId,
	                    type: 'dimensions',
	                    setAttributes: true,
	                    dimensions: {
	                        width: newWidth + (xChange ? origin[0] * xChange - widthChange : 0),
	                        height: newHeight + (yChange ? origin[1] * yChange - heightChange : 0),
	                    },
	                });
	            }
	        });
	    }
	    return changes;
	}
	function updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent, zIndexMode) {
	    const viewportNode = domNode?.querySelector('.xyflow__viewport');
	    let updatedInternals = false;
	    if (!viewportNode) {
	        return { changes: [], updatedInternals };
	    }
	    const changes = [];
	    const style = window.getComputedStyle(viewportNode);
	    const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
	    // in this array we collect nodes, that might trigger changes (like expanding parent)
	    const parentExpandChildren = [];
	    for (const update of updates.values()) {
	        const node = nodeLookup.get(update.id);
	        if (!node) {
	            continue;
	        }
	        if (node.hidden) {
	            nodeLookup.set(node.id, {
	                ...node,
	                internals: {
	                    ...node.internals,
	                    handleBounds: undefined,
	                },
	            });
	            updatedInternals = true;
	            continue;
	        }
	        const dimensions = getDimensions(update.nodeElement);
	        const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
	        const doUpdate = !!(dimensions.width &&
	            dimensions.height &&
	            (dimensionChanged || !node.internals.handleBounds || update.force));
	        if (doUpdate) {
	            const nodeBounds = update.nodeElement.getBoundingClientRect();
	            const extent = isCoordinateExtent(node.extent) ? node.extent : nodeExtent;
	            let { positionAbsolute } = node.internals;
	            if (node.parentId && node.extent === 'parent') {
	                positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, nodeLookup.get(node.parentId));
	            }
	            else if (extent) {
	                positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
	            }
	            const newNode = {
	                ...node,
	                measured: dimensions,
	                internals: {
	                    ...node.internals,
	                    positionAbsolute,
	                    handleBounds: {
	                        source: getHandleBounds('source', update.nodeElement, nodeBounds, zoom, node.id),
	                        target: getHandleBounds('target', update.nodeElement, nodeBounds, zoom, node.id),
	                    },
	                },
	            };
	            nodeLookup.set(node.id, newNode);
	            if (node.parentId) {
	                updateChildNode(newNode, nodeLookup, parentLookup, { nodeOrigin, zIndexMode });
	            }
	            updatedInternals = true;
	            if (dimensionChanged) {
	                changes.push({
	                    id: node.id,
	                    type: 'dimensions',
	                    dimensions,
	                });
	                if (node.expandParent && node.parentId) {
	                    parentExpandChildren.push({
	                        id: node.id,
	                        parentId: node.parentId,
	                        rect: nodeToRect(newNode, nodeOrigin),
	                    });
	                }
	            }
	        }
	    }
	    if (parentExpandChildren.length > 0) {
	        const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
	        changes.push(...parentExpandChanges);
	    }
	    return { changes, updatedInternals };
	}
	async function panBy({ delta, panZoom, transform, translateExtent, width, height, }) {
	    if (!panZoom || (!delta.x && !delta.y)) {
	        return Promise.resolve(false);
	    }
	    const nextViewport = await panZoom.setViewportConstrained({
	        x: transform[0] + delta.x,
	        y: transform[1] + delta.y,
	        zoom: transform[2],
	    }, [
	        [0, 0],
	        [width, height],
	    ], translateExtent);
	    const transformChanged = !!nextViewport &&
	        (nextViewport.x !== transform[0] || nextViewport.y !== transform[1] || nextViewport.k !== transform[2]);
	    return Promise.resolve(transformChanged);
	}
	/**
	 * this function adds the connection to the connectionLookup
	 * at the following keys: nodeId-type-handleId, nodeId-type and nodeId
	 * @param type type of the connection
	 * @param connection connection that should be added to the lookup
	 * @param connectionKey at which key the connection should be added
	 * @param connectionLookup reference to the connection lookup
	 * @param nodeId nodeId of the connection
	 * @param handleId handleId of the conneciton
	 */
	function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
	    /*
	     * We add the connection to the connectionLookup at the following keys
	     * 1. nodeId, 2. nodeId-type, 3. nodeId-type-handleId
	     * If the key already exists, we add the connection to the existing map
	     */
	    let key = nodeId;
	    const nodeMap = connectionLookup.get(key) || new Map();
	    connectionLookup.set(key, nodeMap.set(connectionKey, connection));
	    key = `${nodeId}-${type}`;
	    const typeMap = connectionLookup.get(key) || new Map();
	    connectionLookup.set(key, typeMap.set(connectionKey, connection));
	    if (handleId) {
	        key = `${nodeId}-${type}-${handleId}`;
	        const handleMap = connectionLookup.get(key) || new Map();
	        connectionLookup.set(key, handleMap.set(connectionKey, connection));
	    }
	}
	function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
	    connectionLookup.clear();
	    edgeLookup.clear();
	    for (const edge of edges) {
	        const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;
	        const connection = { edgeId: edge.id, source: sourceNode, target: targetNode, sourceHandle, targetHandle };
	        const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
	        const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;
	        addConnectionToLookup('source', connection, targetKey, connectionLookup, sourceNode, sourceHandle);
	        addConnectionToLookup('target', connection, sourceKey, connectionLookup, targetNode, targetHandle);
	        edgeLookup.set(edge.id, edge);
	    }
	}

	function isParentSelected(node, nodeLookup) {
	    if (!node.parentId) {
	        return false;
	    }
	    const parentNode = nodeLookup.get(node.parentId);
	    if (!parentNode) {
	        return false;
	    }
	    if (parentNode.selected) {
	        return true;
	    }
	    return isParentSelected(parentNode, nodeLookup);
	}
	function hasSelector(target, selector, domNode) {
	    let current = target;
	    do {
	        if (current?.matches?.(selector))
	            return true;
	        if (current === domNode)
	            return false;
	        current = current?.parentElement;
	    } while (current);
	    return false;
	}
	// looks for all selected nodes and created a NodeDragItem for each of them
	function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
	    const dragItems = new Map();
	    for (const [id, node] of nodeLookup) {
	        if ((node.selected || node.id === nodeId) &&
	            (!node.parentId || !isParentSelected(node, nodeLookup)) &&
	            (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'))) {
	            const internalNode = nodeLookup.get(id);
	            if (internalNode) {
	                dragItems.set(id, {
	                    id,
	                    position: internalNode.position || { x: 0, y: 0 },
	                    distance: {
	                        x: mousePos.x - internalNode.internals.positionAbsolute.x,
	                        y: mousePos.y - internalNode.internals.positionAbsolute.y,
	                    },
	                    extent: internalNode.extent,
	                    parentId: internalNode.parentId,
	                    origin: internalNode.origin,
	                    expandParent: internalNode.expandParent,
	                    internals: {
	                        positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 },
	                    },
	                    measured: {
	                        width: internalNode.measured.width ?? 0,
	                        height: internalNode.measured.height ?? 0,
	                    },
	                });
	            }
	        }
	    }
	    return dragItems;
	}
	/*
	 * returns two params:
	 * 1. the dragged node (or the first of the list, if we are dragging a node selection)
	 * 2. array of selected nodes (for multi selections)
	 */
	function getEventHandlerParams({ nodeId, dragItems, nodeLookup, dragging = true, }) {
	    const nodesFromDragItems = [];
	    for (const [id, dragItem] of dragItems) {
	        const node = nodeLookup.get(id)?.internals.userNode;
	        if (node) {
	            nodesFromDragItems.push({
	                ...node,
	                position: dragItem.position,
	                dragging,
	            });
	        }
	    }
	    if (!nodeId) {
	        return [nodesFromDragItems[0], nodesFromDragItems];
	    }
	    const node = nodeLookup.get(nodeId)?.internals.userNode;
	    return [
	        !node
	            ? nodesFromDragItems[0]
	            : {
	                ...node,
	                position: dragItems.get(nodeId)?.position || node.position,
	                dragging,
	            },
	        nodesFromDragItems,
	    ];
	}
	/**
	 * If a selection is being dragged we want to apply the same snap offset to all nodes in the selection.
	 * This function calculates the snap offset based on the first node in the selection.
	 */
	function calculateSnapOffset({ dragItems, snapGrid, x, y, }) {
	    const refDragItem = dragItems.values().next().value;
	    if (!refDragItem) {
	        return null;
	    }
	    const refPos = {
	        x: x - refDragItem.distance.x,
	        y: y - refDragItem.distance.y,
	    };
	    const refPosSnapped = snapPosition(refPos, snapGrid);
	    return {
	        x: refPosSnapped.x - refPos.x,
	        y: refPosSnapped.y - refPos.y,
	    };
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function XYDrag({ onNodeMouseDown, getStoreItems, onDragStart, onDrag, onDragStop, }) {
	    let lastPos = { x: null, y: null };
	    let autoPanId = 0;
	    let dragItems = new Map();
	    let autoPanStarted = false;
	    let mousePosition = { x: 0, y: 0 };
	    let containerBounds = null;
	    let dragStarted = false;
	    let d3Selection = null;
	    let abortDrag = false; // prevents unintentional dragging on multitouch
	    let nodePositionsChanged = false;
	    // we store the last drag event to be able to use it in the update function
	    let dragEvent = null;
	    // public functions
	    function update({ noDragClassName, handleSelector, domNode, isSelectable, nodeId, nodeClickDistance = 0, }) {
	        d3Selection = select(domNode);
	        function updateNodes({ x, y }) {
	            const { nodeLookup, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onNodeDrag, onSelectionDrag, onError, updateNodePositions, } = getStoreItems();
	            lastPos = { x, y };
	            let hasChange = false;
	            const isMultiDrag = dragItems.size > 1;
	            const nodesBox = isMultiDrag && nodeExtent ? rectToBox(getInternalNodesBounds(dragItems)) : null;
	            const multiDragSnapOffset = isMultiDrag && snapToGrid
	                ? calculateSnapOffset({
	                    dragItems,
	                    snapGrid,
	                    x,
	                    y,
	                })
	                : null;
	            for (const [id, dragItem] of dragItems) {
	                /*
	                 * if the node is not in the nodeLookup anymore, it was probably deleted while dragging
	                 */
	                if (!nodeLookup.has(id)) {
	                    continue;
	                }
	                let nextPosition = { x: x - dragItem.distance.x, y: y - dragItem.distance.y };
	                if (snapToGrid) {
	                    nextPosition = multiDragSnapOffset
	                        ? {
	                            x: Math.round(nextPosition.x + multiDragSnapOffset.x),
	                            y: Math.round(nextPosition.y + multiDragSnapOffset.y),
	                        }
	                        : snapPosition(nextPosition, snapGrid);
	                }
	                let adjustedNodeExtent = null;
	                if (isMultiDrag && nodeExtent && !dragItem.extent && nodesBox) {
	                    const { positionAbsolute } = dragItem.internals;
	                    const x1 = positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
	                    const x2 = positionAbsolute.x + dragItem.measured.width - nodesBox.x2 + nodeExtent[1][0];
	                    const y1 = positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
	                    const y2 = positionAbsolute.y + dragItem.measured.height - nodesBox.y2 + nodeExtent[1][1];
	                    adjustedNodeExtent = [
	                        [x1, y1],
	                        [x2, y2],
	                    ];
	                }
	                const { position, positionAbsolute } = calculateNodePosition({
	                    nodeId: id,
	                    nextPosition,
	                    nodeLookup,
	                    nodeExtent: adjustedNodeExtent ? adjustedNodeExtent : nodeExtent,
	                    nodeOrigin,
	                    onError,
	                });
	                // we want to make sure that we only fire a change event when there is a change
	                hasChange = hasChange || dragItem.position.x !== position.x || dragItem.position.y !== position.y;
	                dragItem.position = position;
	                dragItem.internals.positionAbsolute = positionAbsolute;
	            }
	            nodePositionsChanged = nodePositionsChanged || hasChange;
	            if (!hasChange) {
	                return;
	            }
	            updateNodePositions(dragItems, true);
	            if (dragEvent && (onDrag || onNodeDrag || (!nodeId && onSelectionDrag))) {
	                const [currentNode, currentNodes] = getEventHandlerParams({
	                    nodeId,
	                    dragItems,
	                    nodeLookup,
	                });
	                onDrag?.(dragEvent, dragItems, currentNode, currentNodes);
	                onNodeDrag?.(dragEvent, currentNode, currentNodes);
	                if (!nodeId) {
	                    onSelectionDrag?.(dragEvent, currentNodes);
	                }
	            }
	        }
	        async function autoPan() {
	            if (!containerBounds) {
	                return;
	            }
	            const { transform, panBy, autoPanSpeed, autoPanOnNodeDrag } = getStoreItems();
	            if (!autoPanOnNodeDrag) {
	                autoPanStarted = false;
	                cancelAnimationFrame(autoPanId);
	                return;
	            }
	            const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds, autoPanSpeed);
	            if (xMovement !== 0 || yMovement !== 0) {
	                lastPos.x = (lastPos.x ?? 0) - xMovement / transform[2];
	                lastPos.y = (lastPos.y ?? 0) - yMovement / transform[2];
	                if (await panBy({ x: xMovement, y: yMovement })) {
	                    updateNodes(lastPos);
	                }
	            }
	            autoPanId = requestAnimationFrame(autoPan);
	        }
	        function startDrag(event) {
	            const { nodeLookup, multiSelectionActive, nodesDraggable, transform, snapGrid, snapToGrid, selectNodesOnDrag, onNodeDragStart, onSelectionDragStart, unselectNodesAndEdges, } = getStoreItems();
	            dragStarted = true;
	            if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
	                if (!nodeLookup.get(nodeId)?.selected) {
	                    // we need to reset selected nodes when selectNodesOnDrag=false
	                    unselectNodesAndEdges();
	                }
	            }
	            if (isSelectable && selectNodesOnDrag && nodeId) {
	                onNodeMouseDown?.(nodeId);
	            }
	            const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
	            lastPos = pointerPos;
	            dragItems = getDragItems(nodeLookup, nodesDraggable, pointerPos, nodeId);
	            if (dragItems.size > 0 && (onDragStart || onNodeDragStart || (!nodeId && onSelectionDragStart))) {
	                const [currentNode, currentNodes] = getEventHandlerParams({
	                    nodeId,
	                    dragItems,
	                    nodeLookup,
	                });
	                onDragStart?.(event.sourceEvent, dragItems, currentNode, currentNodes);
	                onNodeDragStart?.(event.sourceEvent, currentNode, currentNodes);
	                if (!nodeId) {
	                    onSelectionDragStart?.(event.sourceEvent, currentNodes);
	                }
	            }
	        }
	        const d3DragInstance = drag$1()
	            .clickDistance(nodeClickDistance)
	            .on('start', (event) => {
	            const { domNode, nodeDragThreshold, transform, snapGrid, snapToGrid } = getStoreItems();
	            containerBounds = domNode?.getBoundingClientRect() || null;
	            abortDrag = false;
	            nodePositionsChanged = false;
	            dragEvent = event.sourceEvent;
	            if (nodeDragThreshold === 0) {
	                startDrag(event);
	            }
	            const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
	            lastPos = pointerPos;
	            mousePosition = getEventPosition(event.sourceEvent, containerBounds);
	        })
	            .on('drag', (event) => {
	            const { autoPanOnNodeDrag, transform, snapGrid, snapToGrid, nodeDragThreshold, nodeLookup } = getStoreItems();
	            const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
	            dragEvent = event.sourceEvent;
	            if ((event.sourceEvent.type === 'touchmove' && event.sourceEvent.touches.length > 1) ||
	                // if user deletes a node while dragging, we need to abort the drag to prevent errors
	                (nodeId && !nodeLookup.has(nodeId))) {
	                abortDrag = true;
	            }
	            if (abortDrag) {
	                return;
	            }
	            if (!autoPanStarted && autoPanOnNodeDrag && dragStarted) {
	                autoPanStarted = true;
	                autoPan();
	            }
	            if (!dragStarted) {
	                // Calculate distance in client coordinates for consistent drag threshold behavior across zoom levels
	                const currentMousePosition = getEventPosition(event.sourceEvent, containerBounds);
	                const x = currentMousePosition.x - mousePosition.x;
	                const y = currentMousePosition.y - mousePosition.y;
	                const distance = Math.sqrt(x * x + y * y);
	                if (distance > nodeDragThreshold) {
	                    startDrag(event);
	                }
	            }
	            // skip events without movement
	            if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems && dragStarted) {
	                mousePosition = getEventPosition(event.sourceEvent, containerBounds);
	                updateNodes(pointerPos);
	            }
	        })
	            .on('end', (event) => {
	            if (!dragStarted || abortDrag) {
	                return;
	            }
	            autoPanStarted = false;
	            dragStarted = false;
	            cancelAnimationFrame(autoPanId);
	            if (dragItems.size > 0) {
	                const { nodeLookup, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStoreItems();
	                if (nodePositionsChanged) {
	                    updateNodePositions(dragItems, false);
	                    nodePositionsChanged = false;
	                }
	                if (onDragStop || onNodeDragStop || (!nodeId && onSelectionDragStop)) {
	                    const [currentNode, currentNodes] = getEventHandlerParams({
	                        nodeId,
	                        dragItems,
	                        nodeLookup,
	                        dragging: false,
	                    });
	                    onDragStop?.(event.sourceEvent, dragItems, currentNode, currentNodes);
	                    onNodeDragStop?.(event.sourceEvent, currentNode, currentNodes);
	                    if (!nodeId) {
	                        onSelectionDragStop?.(event.sourceEvent, currentNodes);
	                    }
	                }
	            }
	        })
	            .filter((event) => {
	            const target = event.target;
	            const isDraggable = !event.button &&
	                (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, domNode)) &&
	                (!handleSelector || hasSelector(target, handleSelector, domNode));
	            return isDraggable;
	        });
	        d3Selection.call(d3DragInstance);
	    }
	    function destroy() {
	        d3Selection?.on('.drag', null);
	    }
	    return {
	        update,
	        destroy,
	    };
	}

	function getNodesWithinDistance(position, nodeLookup, distance) {
	    const nodes = [];
	    const rect = {
	        x: position.x - distance,
	        y: position.y - distance,
	        width: distance * 2,
	        height: distance * 2,
	    };
	    for (const node of nodeLookup.values()) {
	        if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
	            nodes.push(node);
	        }
	    }
	    return nodes;
	}
	/*
	 * this distance is used for the area around the user pointer
	 * while doing a connection for finding the closest nodes
	 */
	const ADDITIONAL_DISTANCE = 250;
	function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
	    let closestHandles = [];
	    let minDistance = Infinity;
	    const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
	    for (const node of closeNodes) {
	        const allHandles = [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];
	        for (const handle of allHandles) {
	            // if the handle is the same as the fromHandle we skip it
	            if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
	                continue;
	            }
	            // determine absolute position of the handle
	            const { x, y } = getHandlePosition(node, handle, handle.position, true);
	            const distance = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
	            if (distance > connectionRadius) {
	                continue;
	            }
	            if (distance < minDistance) {
	                closestHandles = [{ ...handle, x, y }];
	                minDistance = distance;
	            }
	            else if (distance === minDistance) {
	                // when multiple handles are on the same distance we collect all of them
	                closestHandles.push({ ...handle, x, y });
	            }
	        }
	    }
	    if (!closestHandles.length) {
	        return null;
	    }
	    // when multiple handles overlay each other we prefer the opposite handle
	    if (closestHandles.length > 1) {
	        const oppositeHandleType = fromHandle.type === 'source' ? 'target' : 'source';
	        return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
	    }
	    return closestHandles[0];
	}
	function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
	    const node = nodeLookup.get(nodeId);
	    if (!node) {
	        return null;
	    }
	    const handles = connectionMode === 'strict'
	        ? node.internals.handleBounds?.[handleType]
	        : [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];
	    const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;
	    return handle && withAbsolutePosition
	        ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) }
	        : handle;
	}
	function getHandleType(edgeUpdaterType, handleDomNode) {
	    if (edgeUpdaterType) {
	        return edgeUpdaterType;
	    }
	    else if (handleDomNode?.classList.contains('target')) {
	        return 'target';
	    }
	    else if (handleDomNode?.classList.contains('source')) {
	        return 'source';
	    }
	    return null;
	}
	function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
	    let isValid = null;
	    if (isHandleValid) {
	        isValid = true;
	    }
	    else if (isInsideConnectionRadius && !isHandleValid) {
	        isValid = false;
	    }
	    return isValid;
	}

	const alwaysValid = () => true;
	function onPointerDown(event, { connectionMode, connectionRadius, handleId, nodeId, edgeUpdaterType, isTarget, domNode, nodeLookup, lib, autoPanOnConnect, flowId, panBy, cancelConnection, onConnectStart, onConnect, onConnectEnd, isValidConnection = alwaysValid, onReconnectEnd, updateConnection, getTransform, getFromHandle, autoPanSpeed, dragThreshold = 1, handleDomNode, }) {
	    // when xyflow is used inside a shadow root we can't use document
	    const doc = getHostForElement(event.target);
	    let autoPanId = 0;
	    let closestHandle;
	    const { x, y } = getEventPosition(event);
	    const handleType = getHandleType(edgeUpdaterType, handleDomNode);
	    const containerBounds = domNode?.getBoundingClientRect();
	    let connectionStarted = false;
	    if (!containerBounds || !handleType) {
	        return;
	    }
	    const fromHandleInternal = getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode);
	    if (!fromHandleInternal) {
	        return;
	    }
	    let position = getEventPosition(event, containerBounds);
	    let autoPanStarted = false;
	    let connection = null;
	    let isValid = false;
	    let resultHandleDomNode = null;
	    // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
	    function autoPan() {
	        if (!autoPanOnConnect || !containerBounds) {
	            return;
	        }
	        const [x, y] = calcAutoPan(position, containerBounds, autoPanSpeed);
	        panBy({ x, y });
	        autoPanId = requestAnimationFrame(autoPan);
	    }
	    // Stays the same for all consecutive pointermove events
	    const fromHandle = {
	        ...fromHandleInternal,
	        nodeId,
	        type: handleType,
	        position: fromHandleInternal.position,
	    };
	    const fromInternalNode = nodeLookup.get(nodeId);
	    const from = getHandlePosition(fromInternalNode, fromHandle, Position.Left, true);
	    let previousConnection = {
	        inProgress: true,
	        isValid: null,
	        from,
	        fromHandle,
	        fromPosition: fromHandle.position,
	        fromNode: fromInternalNode,
	        to: position,
	        toHandle: null,
	        toPosition: oppositePosition[fromHandle.position],
	        toNode: null,
	        pointer: position,
	    };
	    function startConnection() {
	        connectionStarted = true;
	        updateConnection(previousConnection);
	        onConnectStart?.(event, { nodeId, handleId, handleType });
	    }
	    if (dragThreshold === 0) {
	        startConnection();
	    }
	    function onPointerMove(event) {
	        if (!connectionStarted) {
	            const { x: evtX, y: evtY } = getEventPosition(event);
	            const dx = evtX - x;
	            const dy = evtY - y;
	            const nextConnectionStarted = dx * dx + dy * dy > dragThreshold * dragThreshold;
	            if (!nextConnectionStarted) {
	                return;
	            }
	            startConnection();
	        }
	        if (!getFromHandle() || !fromHandle) {
	            onPointerUp(event);
	            return;
	        }
	        const transform = getTransform();
	        position = getEventPosition(event, containerBounds);
	        closestHandle = getClosestHandle(pointToRendererPoint(position, transform, false, [1, 1]), connectionRadius, nodeLookup, fromHandle);
	        if (!autoPanStarted) {
	            autoPan();
	            autoPanStarted = true;
	        }
	        const result = isValidHandle(event, {
	            handle: closestHandle,
	            connectionMode,
	            fromNodeId: nodeId,
	            fromHandleId: handleId,
	            fromType: isTarget ? 'target' : 'source',
	            isValidConnection,
	            doc,
	            lib,
	            flowId,
	            nodeLookup,
	        });
	        resultHandleDomNode = result.handleDomNode;
	        connection = result.connection;
	        isValid = isConnectionValid(!!closestHandle, result.isValid);
	        const fromInternalNode = nodeLookup.get(nodeId);
	        const from = fromInternalNode
	            ? getHandlePosition(fromInternalNode, fromHandle, Position.Left, true)
	            : previousConnection.from;
	        const newConnection = {
	            ...previousConnection,
	            from,
	            isValid,
	            to: result.toHandle && isValid
	                ? rendererPointToPoint({ x: result.toHandle.x, y: result.toHandle.y }, transform)
	                : position,
	            toHandle: result.toHandle,
	            toPosition: isValid && result.toHandle ? result.toHandle.position : oppositePosition[fromHandle.position],
	            toNode: result.toHandle ? nodeLookup.get(result.toHandle.nodeId) : null,
	            pointer: position,
	        };
	        updateConnection(newConnection);
	        previousConnection = newConnection;
	    }
	    function onPointerUp(event) {
	        // Prevent multi-touch aborting connection
	        if ('touches' in event && event.touches.length > 0) {
	            return;
	        }
	        if (connectionStarted) {
	            if ((closestHandle || resultHandleDomNode) && connection && isValid) {
	                onConnect?.(connection);
	            }
	            /*
	             * it's important to get a fresh reference from the store here
	             * in order to get the latest state of onConnectEnd
	             */
	            // eslint-disable-next-line @typescript-eslint/no-unused-vars
	            const { inProgress, ...connectionState } = previousConnection;
	            const finalConnectionState = {
	                ...connectionState,
	                toPosition: previousConnection.toHandle ? previousConnection.toPosition : null,
	            };
	            onConnectEnd?.(event, finalConnectionState);
	            if (edgeUpdaterType) {
	                onReconnectEnd?.(event, finalConnectionState);
	            }
	        }
	        cancelConnection();
	        cancelAnimationFrame(autoPanId);
	        autoPanStarted = false;
	        isValid = false;
	        connection = null;
	        resultHandleDomNode = null;
	        doc.removeEventListener('mousemove', onPointerMove);
	        doc.removeEventListener('mouseup', onPointerUp);
	        doc.removeEventListener('touchmove', onPointerMove);
	        doc.removeEventListener('touchend', onPointerUp);
	    }
	    doc.addEventListener('mousemove', onPointerMove);
	    doc.addEventListener('mouseup', onPointerUp);
	    doc.addEventListener('touchmove', onPointerMove);
	    doc.addEventListener('touchend', onPointerUp);
	}
	// checks if  and returns connection in fom of an object { source: 123, target: 312 }
	function isValidHandle(event, { handle, connectionMode, fromNodeId, fromHandleId, fromType, doc, lib, flowId, isValidConnection = alwaysValid, nodeLookup, }) {
	    const isTarget = fromType === 'target';
	    const handleDomNode = handle
	        ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle?.nodeId}-${handle?.id}-${handle?.type}"]`)
	        : null;
	    const { x, y } = getEventPosition(event);
	    const handleBelow = doc.elementFromPoint(x, y);
	    /*
	     * we always want to prioritize the handle below the mouse cursor over the closest distance handle,
	     * because it could be that the center of another handle is closer to the mouse pointer than the handle below the cursor
	     */
	    const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;
	    const result = {
	        handleDomNode: handleToCheck,
	        isValid: false,
	        connection: null,
	        toHandle: null,
	    };
	    if (handleToCheck) {
	        const handleType = getHandleType(undefined, handleToCheck);
	        const handleNodeId = handleToCheck.getAttribute('data-nodeid');
	        const handleId = handleToCheck.getAttribute('data-handleid');
	        const connectable = handleToCheck.classList.contains('connectable');
	        const connectableEnd = handleToCheck.classList.contains('connectableend');
	        if (!handleNodeId || !handleType) {
	            return result;
	        }
	        const connection = {
	            source: isTarget ? handleNodeId : fromNodeId,
	            sourceHandle: isTarget ? handleId : fromHandleId,
	            target: isTarget ? fromNodeId : handleNodeId,
	            targetHandle: isTarget ? fromHandleId : handleId,
	        };
	        result.connection = connection;
	        const isConnectable = connectable && connectableEnd;
	        // in strict mode we don't allow target to target or source to source connections
	        const isValid = isConnectable &&
	            (connectionMode === ConnectionMode.Strict
	                ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
	                : handleNodeId !== fromNodeId || handleId !== fromHandleId);
	        result.isValid = isValid && isValidConnection(connection);
	        result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
	    }
	    return result;
	}
	const XYHandle = {
	    onPointerDown,
	    isValid: isValidHandle,
	};

	/* eslint-disable @typescript-eslint/no-explicit-any */
	const transformToViewport = (transform) => ({
	    x: transform.x,
	    y: transform.y,
	    zoom: transform.k,
	});
	const viewportToTransform = ({ x, y, zoom }) => identity.translate(x, y).scale(zoom);
	const isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
	const isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
	// taken from d3-ease: https://github.com/d3/d3-ease/blob/main/src/cubic.js
	const defaultEase = (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	const getD3Transition = (selection, duration = 0, ease = defaultEase, onEnd = () => { }) => {
	    const hasDuration = typeof duration === 'number' && duration > 0;
	    if (!hasDuration) {
	        onEnd();
	    }
	    return hasDuration ? selection.transition().duration(duration).ease(ease).on('end', onEnd) : selection;
	};
	const wheelDelta = (event) => {
	    const factor = event.ctrlKey && isMacOs() ? 10 : 1;
	    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
	};

	function createPanOnScrollHandler({ zoomPanValues, noWheelClassName, d3Selection, d3Zoom, panOnScrollMode, panOnScrollSpeed, zoomOnPinch, onPanZoomStart, onPanZoom, onPanZoomEnd, }) {
	    return (event) => {
	        if (isWrappedWithClass(event, noWheelClassName)) {
	            if (event.ctrlKey) {
	                event.preventDefault(); // stop native page zoom for pinch zooming
	            }
	            return false;
	        }
	        event.preventDefault();
	        event.stopImmediatePropagation();
	        const currentZoom = d3Selection.property('__zoom').k || 1;
	        // macos sets ctrlKey=true for pinch gesture on a trackpad
	        if (event.ctrlKey && zoomOnPinch) {
	            const point = pointer(event);
	            const pinchDelta = wheelDelta(event);
	            const zoom = currentZoom * Math.pow(2, pinchDelta);
	            // @ts-ignore
	            d3Zoom.scaleTo(d3Selection, zoom, point, event);
	            return;
	        }
	        /*
	         * increase scroll speed in firefox
	         * firefox: deltaMode === 1; chrome: deltaMode === 0
	         */
	        const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
	        let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
	        let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
	        // this enables vertical scrolling with shift + scroll on windows
	        if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
	            deltaX = event.deltaY * deltaNormalize;
	            deltaY = 0;
	        }
	        d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed, 
	        // @ts-ignore
	        { internal: true });
	        const nextViewport = transformToViewport(d3Selection.property('__zoom'));
	        clearTimeout(zoomPanValues.panScrollTimeout);
	        /*
	         * for pan on scroll we need to handle the event calls on our own
	         * we can't use the start, zoom and end events from d3-zoom
	         * because start and move gets called on every scroll event and not once at the beginning
	         */
	        if (!zoomPanValues.isPanScrolling) {
	            zoomPanValues.isPanScrolling = true;
	            onPanZoomStart?.(event, nextViewport);
	        }
	        else {
	            onPanZoom?.(event, nextViewport);
	            zoomPanValues.panScrollTimeout = setTimeout(() => {
	                onPanZoomEnd?.(event, nextViewport);
	                zoomPanValues.isPanScrolling = false;
	            }, 150);
	        }
	    };
	}
	function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }) {
	    return function (event, d) {
	        const isWheel = event.type === 'wheel';
	        // we still want to enable pinch zooming even if preventScrolling is set to false
	        const preventZoom = !preventScrolling && isWheel && !event.ctrlKey;
	        const hasNoWheelClass = isWrappedWithClass(event, noWheelClassName);
	        // if user is pinch zooming above a nowheel element, we don't want the browser to zoom
	        if (event.ctrlKey && isWheel && hasNoWheelClass) {
	            event.preventDefault();
	        }
	        if (preventZoom || hasNoWheelClass) {
	            return null;
	        }
	        event.preventDefault();
	        d3ZoomHandler.call(this, event, d);
	    };
	}
	function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }) {
	    return (event) => {
	        if (event.sourceEvent?.internal) {
	            return;
	        }
	        const viewport = transformToViewport(event.transform);
	        // we need to remember it here, because it's always 0 in the "zoom" event
	        zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
	        zoomPanValues.isZoomingOrPanning = true;
	        zoomPanValues.prevViewport = viewport;
	        if (event.sourceEvent?.type === 'mousedown') {
	            onDraggingChange(true);
	        }
	        if (onPanZoomStart) {
	            onPanZoomStart?.(event.sourceEvent, viewport);
	        }
	    };
	}
	function createPanZoomHandler({ zoomPanValues, panOnDrag, onPaneContextMenu, onTransformChange, onPanZoom, }) {
	    return (event) => {
	        zoomPanValues.usedRightMouseButton = !!(onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0));
	        if (!event.sourceEvent?.sync) {
	            onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
	        }
	        if (onPanZoom && !event.sourceEvent?.internal) {
	            onPanZoom?.(event.sourceEvent, transformToViewport(event.transform));
	        }
	    };
	}
	function createPanZoomEndHandler({ zoomPanValues, panOnDrag, panOnScroll, onDraggingChange, onPanZoomEnd, onPaneContextMenu, }) {
	    return (event) => {
	        if (event.sourceEvent?.internal) {
	            return;
	        }
	        zoomPanValues.isZoomingOrPanning = false;
	        if (onPaneContextMenu &&
	            isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
	            !zoomPanValues.usedRightMouseButton &&
	            event.sourceEvent) {
	            onPaneContextMenu(event.sourceEvent);
	        }
	        zoomPanValues.usedRightMouseButton = false;
	        onDraggingChange(false);
	        if (onPanZoomEnd) {
	            const viewport = transformToViewport(event.transform);
	            zoomPanValues.prevViewport = viewport;
	            clearTimeout(zoomPanValues.timerId);
	            zoomPanValues.timerId = setTimeout(() => {
	                onPanZoomEnd?.(event.sourceEvent, viewport);
	            }, 
	            // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
	            panOnScroll ? 150 : 0);
	        }
	    };
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	function createFilter({ zoomActivationKeyPressed, zoomOnScroll, zoomOnPinch, panOnDrag, panOnScroll, zoomOnDoubleClick, userSelectionActive, noWheelClassName, noPanClassName, lib, connectionInProgress, }) {
	    return (event) => {
	        const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
	        const pinchZoom = zoomOnPinch && event.ctrlKey;
	        const isWheelEvent = event.type === 'wheel';
	        if (event.button === 1 &&
	            event.type === 'mousedown' &&
	            (isWrappedWithClass(event, `${lib}-flow__node`) || isWrappedWithClass(event, `${lib}-flow__edge`))) {
	            return true;
	        }
	        // if all interactions are disabled, we prevent all zoom events
	        if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
	            return false;
	        }
	        // during a selection we prevent all other interactions
	        if (userSelectionActive) {
	            return false;
	        }
	        // we want to disable pinch-zooming while making a connection
	        if (connectionInProgress && !isWheelEvent) {
	            return false;
	        }
	        // if the target element is inside an element with the nowheel class, we prevent zooming
	        if (isWrappedWithClass(event, noWheelClassName) && isWheelEvent) {
	            return false;
	        }
	        // if the target element is inside an element with the nopan class, we prevent panning
	        if (isWrappedWithClass(event, noPanClassName) &&
	            (!isWheelEvent || (panOnScroll && isWheelEvent && !zoomActivationKeyPressed))) {
	            return false;
	        }
	        if (!zoomOnPinch && event.ctrlKey && isWheelEvent) {
	            return false;
	        }
	        if (!zoomOnPinch && event.type === 'touchstart' && event.touches?.length > 1) {
	            event.preventDefault(); // if you manage to start with 2 touches, we prevent native zoom
	            return false;
	        }
	        // when there is no scroll handling enabled, we prevent all wheel events
	        if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
	            return false;
	        }
	        // if the pane is not movable, we prevent dragging it with mousestart or touchstart
	        if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
	            return false;
	        }
	        // if the pane is only movable using allowed clicks
	        if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === 'mousedown') {
	            return false;
	        }
	        // We only allow right clicks if pan on drag is set to right click
	        const buttonAllowed = (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;
	        // default filter for d3-zoom
	        return (!event.ctrlKey || isWheelEvent) && buttonAllowed;
	    };
	}

	function XYPanZoom({ domNode, minZoom, maxZoom, translateExtent, viewport, onPanZoom, onPanZoomStart, onPanZoomEnd, onDraggingChange, }) {
	    const zoomPanValues = {
	        isZoomingOrPanning: false,
	        usedRightMouseButton: false,
	        prevViewport: { },
	        mouseButton: 0,
	        timerId: undefined,
	        panScrollTimeout: undefined,
	        isPanScrolling: false,
	    };
	    const bbox = domNode.getBoundingClientRect();
	    const d3ZoomInstance = zoom$1().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
	    const d3Selection = select(domNode).call(d3ZoomInstance);
	    setViewportConstrained({
	        x: viewport.x,
	        y: viewport.y,
	        zoom: clamp(viewport.zoom, minZoom, maxZoom),
	    }, [
	        [0, 0],
	        [bbox.width, bbox.height],
	    ], translateExtent);
	    const d3ZoomHandler = d3Selection.on('wheel.zoom');
	    const d3DblClickZoomHandler = d3Selection.on('dblclick.zoom');
	    d3ZoomInstance.wheelDelta(wheelDelta);
	    function setTransform(transform, options) {
	        if (d3Selection) {
	            return new Promise((resolve) => {
	                d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate$1 : interpolateZoom).transform(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), transform);
	            });
	        }
	        return Promise.resolve(false);
	    }
	    // public functions
	    function update({ noWheelClassName, noPanClassName, onPaneContextMenu, userSelectionActive, panOnScroll, panOnDrag, panOnScrollMode, panOnScrollSpeed, preventScrolling, zoomOnPinch, zoomOnScroll, zoomOnDoubleClick, zoomActivationKeyPressed, lib, onTransformChange, connectionInProgress, paneClickDistance, selectionOnDrag, }) {
	        if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
	            destroy();
	        }
	        const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;
	        d3ZoomInstance.clickDistance(selectionOnDrag ? Infinity : !isNumeric(paneClickDistance) || paneClickDistance < 0 ? 0 : paneClickDistance);
	        const wheelHandler = isPanOnScroll
	            ? createPanOnScrollHandler({
	                zoomPanValues,
	                noWheelClassName,
	                d3Selection,
	                d3Zoom: d3ZoomInstance,
	                panOnScrollMode,
	                panOnScrollSpeed,
	                zoomOnPinch,
	                onPanZoomStart,
	                onPanZoom,
	                onPanZoomEnd,
	            })
	            : createZoomOnScrollHandler({
	                noWheelClassName,
	                preventScrolling,
	                d3ZoomHandler,
	            });
	        d3Selection.on('wheel.zoom', wheelHandler, { passive: false });
	        if (!userSelectionActive) {
	            // pan zoom start
	            const startHandler = createPanZoomStartHandler({
	                zoomPanValues,
	                onDraggingChange,
	                onPanZoomStart,
	            });
	            d3ZoomInstance.on('start', startHandler);
	            // pan zoom
	            const panZoomHandler = createPanZoomHandler({
	                zoomPanValues,
	                panOnDrag,
	                onPaneContextMenu: !!onPaneContextMenu,
	                onPanZoom,
	                onTransformChange,
	            });
	            d3ZoomInstance.on('zoom', panZoomHandler);
	            // pan zoom end
	            const panZoomEndHandler = createPanZoomEndHandler({
	                zoomPanValues,
	                panOnDrag,
	                panOnScroll,
	                onPaneContextMenu,
	                onPanZoomEnd,
	                onDraggingChange,
	            });
	            d3ZoomInstance.on('end', panZoomEndHandler);
	        }
	        const filter = createFilter({
	            zoomActivationKeyPressed,
	            panOnDrag,
	            zoomOnScroll,
	            panOnScroll,
	            zoomOnDoubleClick,
	            zoomOnPinch,
	            userSelectionActive,
	            noPanClassName,
	            noWheelClassName,
	            lib,
	            connectionInProgress,
	        });
	        d3ZoomInstance.filter(filter);
	        /*
	         * We cannot add zoomOnDoubleClick to the filter above because
	         * double tapping on touch screens circumvents the filter and
	         * dblclick.zoom is fired on the selection directly
	         */
	        if (zoomOnDoubleClick) {
	            d3Selection.on('dblclick.zoom', d3DblClickZoomHandler);
	        }
	        else {
	            d3Selection.on('dblclick.zoom', null);
	        }
	    }
	    function destroy() {
	        d3ZoomInstance.on('zoom', null);
	    }
	    async function setViewportConstrained(viewport, extent, translateExtent) {
	        const nextTransform = viewportToTransform(viewport);
	        const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent);
	        if (contrainedTransform) {
	            await setTransform(contrainedTransform);
	        }
	        return new Promise((resolve) => resolve(contrainedTransform));
	    }
	    async function setViewport(viewport, options) {
	        const nextTransform = viewportToTransform(viewport);
	        await setTransform(nextTransform, options);
	        return new Promise((resolve) => resolve(nextTransform));
	    }
	    function syncViewport(viewport) {
	        if (d3Selection) {
	            const nextTransform = viewportToTransform(viewport);
	            const currentTransform = d3Selection.property('__zoom');
	            if (currentTransform.k !== viewport.zoom ||
	                currentTransform.x !== viewport.x ||
	                currentTransform.y !== viewport.y) {
	                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	                // @ts-ignore
	                d3ZoomInstance?.transform(d3Selection, nextTransform, null, { sync: true });
	            }
	        }
	    }
	    function getViewport() {
	        const transform$1 = d3Selection ? transform(d3Selection.node()) : { x: 0, y: 0, k: 1 };
	        return { x: transform$1.x, y: transform$1.y, zoom: transform$1.k };
	    }
	    function scaleTo(zoom, options) {
	        if (d3Selection) {
	            return new Promise((resolve) => {
	                d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate$1 : interpolateZoom).scaleTo(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), zoom);
	            });
	        }
	        return Promise.resolve(false);
	    }
	    function scaleBy(factor, options) {
	        if (d3Selection) {
	            return new Promise((resolve) => {
	                d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate$1 : interpolateZoom).scaleBy(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), factor);
	            });
	        }
	        return Promise.resolve(false);
	    }
	    function setScaleExtent(scaleExtent) {
	        d3ZoomInstance?.scaleExtent(scaleExtent);
	    }
	    function setTranslateExtent(translateExtent) {
	        d3ZoomInstance?.translateExtent(translateExtent);
	    }
	    function setClickDistance(distance) {
	        const validDistance = !isNumeric(distance) || distance < 0 ? 0 : distance;
	        d3ZoomInstance?.clickDistance(validDistance);
	    }
	    return {
	        update,
	        destroy,
	        setViewport,
	        setViewportConstrained,
	        getViewport,
	        scaleTo,
	        scaleBy,
	        setScaleExtent,
	        setTranslateExtent,
	        syncViewport,
	        setClickDistance,
	    };
	}

	/**
	 * Used to determine the variant of the resize control
	 *
	 * @public
	 */
	var ResizeControlVariant;
	(function (ResizeControlVariant) {
	    ResizeControlVariant["Line"] = "line";
	    ResizeControlVariant["Handle"] = "handle";
	})(ResizeControlVariant || (ResizeControlVariant = {}));

	/**
	 * Creates a type-safe context getter and setter pair.
	 * Extended from Svelte's official createContext pattern.
	 * - When called with an error message string, it throws if the context is not set
	 * - When called without arguments, it returns the context value or undefined
	 */
	function createContext() {
	    const key = {};
	    return [
	        (errorMessage) => {
	            if (errorMessage && !hasContext(key)) {
	                throw new Error(errorMessage);
	            }
	            return getContext(key);
	        },
	        (context) => setContext(key, context)
	    ];
	}
	const [getNodeIdContext, setNodeIdContext] = createContext();
	const [getNodeConnectableContext, setNodeConnectableContext] = createContext();
	const [getEdgeIdContext, setEdgeIdContext] = createContext();

	var root$f = from_html(`<div><!></div>`);

	function Handle($$anchor, $$props) {
		push($$props, true);

		let handleId = prop($$props, 'id', 3, null),
			type = prop($$props, 'type', 3, 'source'),
			position = prop($$props, 'position', 19, () => Position.Top),
			isConnectableStart = prop($$props, 'isConnectableStart', 3, true),
			isConnectableEnd = prop($$props, 'isConnectableEnd', 3, true),
			rest = rest_props($$props, [
				'$$slots',
				'$$events',
				'$$legacy',
				'id',
				'type',
				'position',
				'style',
				'class',
				'isConnectable',
				'isConnectableStart',
				'isConnectableEnd',
				'isValidConnection',
				'onconnect',
				'ondisconnect',
				'children'
			]);

		const nodeId = getNodeIdContext('Handle must be used within a Custom Node component');
		const isConnectableContext = getNodeConnectableContext('Handle must be used within a Custom Node component');
		let isTarget = user_derived(() => type() === 'target');
		let isConnectable = user_derived(() => $$props.isConnectable !== undefined ? $$props.isConnectable : isConnectableContext.value);
		let store = useStore();
		let ariaLabelConfig = user_derived(() => store.ariaLabelConfig);
		let prevConnections = null;

		user_pre_effect(() => {
			if ($$props.onconnect || $$props.ondisconnect) {
				// connectionLookup is not reactive, so we use edges to get notified about updates
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				store.edges;

				let connections = store.connectionLookup.get(`${nodeId}-${type()}${handleId() ? `-${handleId()}` : ''}`);

				if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
					const _connections = connections ?? new Map();

					handleConnectionChange(prevConnections, _connections, $$props.ondisconnect);
					handleConnectionChange(_connections, prevConnections, $$props.onconnect);
				}

				prevConnections = new Map(connections);
			}
		});

		let $$d = user_derived(() => {
				if (!store.connection.inProgress) {
					return [false, false, false, false, null];
				}

				const { fromHandle, toHandle, isValid } = store.connection;
				const connectingFrom = fromHandle && fromHandle.nodeId === nodeId && fromHandle.type === type() && fromHandle.id === handleId();
				const connectingTo = toHandle && toHandle.nodeId === nodeId && toHandle.type === type() && toHandle.id === handleId();

				const isPossibleTargetHandle = store.connectionMode === ConnectionMode.Strict
					? fromHandle?.type !== type()
					: nodeId !== fromHandle?.nodeId || handleId() !== fromHandle?.id;

				const valid = connectingTo && isValid;

				return [
					true,
					connectingFrom,
					connectingTo,
					isPossibleTargetHandle,
					valid
				];
			}),
			$$array = user_derived(() => to_array(get$2($$d), 5)),
			connectionInProgress = user_derived(() => get$2($$array)[0]),
			connectingFrom = user_derived(() => get$2($$array)[1]),
			connectingTo = user_derived(() => get$2($$array)[2]),
			isPossibleTargetHandle = user_derived(() => get$2($$array)[3]),
			valid = user_derived(() => get$2($$array)[4]);

		function onConnectExtended(connection) {
			const edge = store.onbeforeconnect ? store.onbeforeconnect(connection) : connection;

			if (!edge) {
				return;
			}

			store.addEdge(edge);
			store.onconnect?.(connection);
		}

		function onpointerdown(event) {
			const isMouseTriggered = isMouseEvent(event);

			if (event.currentTarget && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) {
				XYHandle.onPointerDown(event, {
					handleId: handleId(),
					nodeId,
					isTarget: get$2(isTarget),
					connectionRadius: store.connectionRadius,
					domNode: store.domNode,
					nodeLookup: store.nodeLookup,
					connectionMode: store.connectionMode,
					lib: 'svelte',
					autoPanOnConnect: store.autoPanOnConnect,
					autoPanSpeed: store.autoPanSpeed,
					flowId: store.flowId,
					isValidConnection: $$props.isValidConnection ?? store.isValidConnection,
					updateConnection: store.updateConnection,
					cancelConnection: store.cancelConnection,
					panBy: store.panBy,
					onConnect: onConnectExtended,
					onConnectStart: (event, startParams) => {
						store.onconnectstart?.(event, {
							nodeId: startParams.nodeId,
							handleId: startParams.handleId,
							handleType: startParams.handleType
						});
					},

					onConnectEnd: (event, connectionState) => {
						store.onconnectend?.(event, connectionState);
					},
					getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
					getFromHandle: () => store.connection.fromHandle,
					dragThreshold: store.connectionDragThreshold,
					handleDomNode: event.currentTarget
				});
			}
		}

		function onclick(event) {
			if (!nodeId || !store.clickConnectStartHandle && !isConnectableStart()) {
				return;
			}

			if (!store.clickConnectStartHandle) {
				store.onclickconnectstart?.(event, { nodeId, handleId: handleId(), handleType: type() });
				store.clickConnectStartHandle = { nodeId, type: type(), id: handleId() };

				return;
			}

			const doc = getHostForElement(event.target);
			const isValidConnectionHandler = $$props.isValidConnection ?? store.isValidConnection;
			const { connectionMode, clickConnectStartHandle, flowId, nodeLookup } = store;

			const { connection, isValid } = XYHandle.isValid(event, {
				handle: { nodeId, id: handleId(), type: type() },
				connectionMode,
				fromNodeId: clickConnectStartHandle.nodeId,
				fromHandleId: clickConnectStartHandle.id ?? null,
				fromType: clickConnectStartHandle.type,
				isValidConnection: isValidConnectionHandler,
				flowId,
				doc,
				lib: 'svelte',
				nodeLookup
			});

			if (isValid && connection) {
				onConnectExtended(connection);
			}

			const connectionClone = structuredClone(snapshot(store.connection));

			delete connectionClone.inProgress;
			connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
			store.onclickconnectend?.(event, connectionClone);
			store.clickConnectStartHandle = null;
		}

		var div = root$f();
		var event_handler = () => {};

		attribute_effect(div, () => ({
			'data-handleid': handleId(),
			'data-nodeid': nodeId,
			'data-handlepos': position(),
			'data-id': `${store.flowId ?? ''}-${nodeId ?? ''}-${handleId() ?? 'null' ?? ''}-${type() ?? ''}`,
			class: [
				'svelte-flow__handle',
				`svelte-flow__handle-${position()}`,
				store.noDragClass,
				store.noPanClass,
				position(),
				$$props.class
			],
			onmousedown: onpointerdown,
			ontouchstart: onpointerdown,
			onclick: store.clickConnect ? onclick : undefined,
			onkeypress: event_handler,
			style: $$props.style,
			role: 'button',
			'aria-label': get$2(ariaLabelConfig)[`handle.ariaLabel`],
			tabindex: '-1',
			...rest,
			[CLASS]: {
				valid: get$2(valid),
				connectingto: get$2(connectingTo),
				connectingfrom: get$2(connectingFrom),
				source: !get$2(isTarget),
				target: get$2(isTarget),
				connectablestart: isConnectableStart(),
				connectableend: isConnectableEnd(),
				connectable: get$2(isConnectable),
				connectionindicator: get$2(isConnectable) && (!get$2(connectionInProgress) || get$2(isPossibleTargetHandle)) && (get$2(connectionInProgress) || store.clickConnectStartHandle ? isConnectableEnd() : isConnectableStart())
			}
		}));

		var node = child(div);

		snippet(node, () => $$props.children ?? noop$1);
		append($$anchor, div);
		pop();
	}

	var root$e = from_html(`<!> <!>`, 1);

	function DefaultNode($$anchor, $$props) {
		push($$props, true);

		let targetPosition = prop($$props, 'targetPosition', 19, () => Position.Top),
			sourcePosition = prop($$props, 'sourcePosition', 19, () => Position.Bottom);

		var fragment = root$e();
		var node = first_child(fragment);

		Handle(node, {
			type: 'target',
			get position() {
				return targetPosition();
			}
		});

		var text = sibling(node);
		var node_1 = sibling(text);

		Handle(node_1, {
			type: 'source',
			get position() {
				return sourcePosition();
			}
		});

		template_effect(() => set_text(text, ` ${$$props.data?.label ?? ''} `));
		append($$anchor, fragment);
		pop();
	}

	var root$d = from_html(` <!>`, 1);

	function InputNode($$anchor, $$props) {
		push($$props, true);

		let data = prop($$props, 'data', 19, () => ({ label: 'Node' })),
			sourcePosition = prop($$props, 'sourcePosition', 19, () => Position.Bottom);

		var fragment = root$d();
		var text = first_child(fragment);
		var node = sibling(text);

		Handle(node, {
			type: 'source',
			get position() {
				return sourcePosition();
			}
		});

		template_effect(() => set_text(text, `${data()?.label ?? ''} `));
		append($$anchor, fragment);
		pop();
	}

	var root$c = from_html(` <!>`, 1);

	function OutputNode($$anchor, $$props) {
		push($$props, true);

		let data = prop($$props, 'data', 19, () => ({ label: 'Node' })),
			targetPosition = prop($$props, 'targetPosition', 19, () => Position.Top);

		var fragment = root$c();
		var text = first_child(fragment);
		var node = sibling(text);

		Handle(node, {
			type: 'target',
			get position() {
				return targetPosition();
			}
		});

		template_effect(() => set_text(text, `${data()?.label ?? ''} `));
		append($$anchor, fragment);
		pop();
	}

	function GroupNode($$anchor, $$props) {
		// eslint-disable-next-line no-empty-pattern
	}

	/* portal.svelte.js generated by Svelte v5.50.3 */

	function tryToMount(node, domNode, target) {
		if (!target || !domNode) {
			return;
		}

		const targetEl = target === 'root'
			? domNode
			: domNode.querySelector(`.svelte-flow__${target}`);

		if (targetEl) {
			targetEl.appendChild(node);
		}
	}

	function portal(node, target) {
		const $$d = user_derived(useStore),
			domNode = user_derived(() => get$2($$d).domNode);

		let destroyEffect;

		// svelte-ignore state_referenced_locally
		if (get$2(domNode)) {
			// if the domNode is already mounted, we can directly try to mount the node
			tryToMount(node, get$2(domNode), target);
		} else {
			// if the domNode is not mounted yet, we need to wait for it to be ready
			destroyEffect = effect_root(() => {
				user_effect(() => {
					tryToMount(node, get$2(domNode), target);
					destroyEffect?.();
				});
			});
		}

		return {
			async update(target) {
				tryToMount(node, get$2(domNode), target);
			},

			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}

				destroyEffect?.();
			}
		};
	}

	/* utils.svelte.js generated by Svelte v5.50.3 */

	function hideOnSSR() {
		let hide = state(typeof window === 'undefined');

		if (get$2(hide)) {
			const destroyEffect = effect_root(() => {
				user_effect(() => {
					set$2(hide, false);
					destroyEffect?.();
				});
			});
		}

		return {
			get value() {
				return get$2(hide);
			}
		};
	}

	/**
	 * Test whether an object is usable as a Node
	 * @public
	 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Node if it returns true
	 * @param element - The element to test
	 * @returns A boolean indicating whether the element is an Node
	 */
	const isNode = (element) => isNodeBase(element);
	/**
	 * Test whether an object is usable as an Edge
	 * @public
	 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Edge if it returns true
	 * @param element - The element to test
	 * @returns A boolean indicating whether the element is an Edge
	 */
	const isEdge = (element) => isEdgeBase(element);
	function toPxString(value) {
	    return value === undefined ? undefined : `${value}px`;
	}
	const arrowKeyDiffs = {
	    ArrowUp: { x: 0, y: -1 },
	    ArrowDown: { x: 0, y: 1 },
	    ArrowLeft: { x: -1, y: 0 },
	    ArrowRight: { x: 1, y: 0 }
	};

	var root$b = from_html(`<div><!></div>`);

	function EdgeLabel($$anchor, $$props) {
		push($$props, true);

		let x = prop($$props, 'x', 3, 0),
			y = prop($$props, 'y', 3, 0),
			selectEdgeOnClick = prop($$props, 'selectEdgeOnClick', 3, false),
			transparent = prop($$props, 'transparent', 3, false),
			rest = rest_props($$props, [
				'$$slots',
				'$$events',
				'$$legacy',
				'x',
				'y',
				'width',
				'height',
				'selectEdgeOnClick',
				'transparent',
				'class',
				'children'
			]);

		const store = useStore();
		const edgeId = getEdgeIdContext('EdgeLabel must be used within a Custom Edge component');

		let z = user_derived(() => {
			return store.visible.edges.get(edgeId)?.zIndex;
		});

		var div = root$b();

		var event_handler = () => {
			if (selectEdgeOnClick() && edgeId) store.handleEdgeSelection(edgeId);
		};

		attribute_effect(
			div,
			($0) => ({
				class: [
					'svelte-flow__edge-label',
					{ transparent: transparent() },
					$$props.class
				],
				tabindex: '-1',
				onclick: event_handler,
				...rest,
				[STYLE]: $0
			}),
			[
				() => ({
					display: hideOnSSR().value ? 'none' : undefined,
					cursor: selectEdgeOnClick() ? 'pointer' : undefined,
					transform: `translate(-50%, -50%) translate(${x() ?? ''}px,${y() ?? ''}px)`,
					'pointer-events': 'all',
					width: toPxString($$props.width),
					height: toPxString($$props.height),
					'z-index': get$2(z)
				})
			],
			void 0,
			void 0,
			'svelte-1wg91mu'
		);

		var node = child(div);

		snippet(node, () => $$props.children ?? noop$1);
		action(div, ($$node, $$action_arg) => portal?.($$node, $$action_arg), () => 'edge-labels');
		append($$anchor, div);
		pop();
	}

	var root_1$8 = from_svg(`<path></path>`);
	var root$a = from_svg(`<path fill="none"></path><!><!>`, 1);

	function BaseEdge($$anchor, $$props) {
		let interactionWidth = prop($$props, 'interactionWidth', 3, 20),
			rest = rest_props($$props, [
				'$$slots',
				'$$events',
				'$$legacy',
				'id',
				'path',
				'label',
				'labelX',
				'labelY',
				'labelStyle',
				'markerStart',
				'markerEnd',
				'style',
				'interactionWidth',
				'class'
			]);

		var fragment = root$a();
		var path_1 = first_child(fragment);
		var node = sibling(path_1);

		{
			var consequent = ($$anchor) => {
				var path_2 = root_1$8();

				attribute_effect(path_2, () => ({
					d: $$props.path,
					'stroke-opacity': 0,
					'stroke-width': interactionWidth(),
					fill: 'none',
					class: 'svelte-flow__edge-interaction',
					...rest
				}));

				append($$anchor, path_2);
			};

			if_block(node, ($$render) => {
				if (interactionWidth() > 0) $$render(consequent);
			});
		}

		var node_1 = sibling(node);

		{
			var consequent_1 = ($$anchor) => {
				EdgeLabel($$anchor, {
					get x() {
						return $$props.labelX;
					},

					get y() {
						return $$props.labelY;
					},

					get style() {
						return $$props.labelStyle;
					},
					selectEdgeOnClick: true,
					children: ($$anchor, $$slotProps) => {

						var text$1 = text();

						template_effect(() => set_text(text$1, $$props.label));
						append($$anchor, text$1);
					},
					$$slots: { default: true }
				});
			};

			if_block(node_1, ($$render) => {
				if ($$props.label) $$render(consequent_1);
			});
		}

		template_effect(() => {
			set_attribute(path_1, 'id', $$props.id);
			set_attribute(path_1, 'd', $$props.path);
			set_class(path_1, 0, clsx(['svelte-flow__edge-path', $$props.class]));
			set_attribute(path_1, 'marker-start', $$props.markerStart);
			set_attribute(path_1, 'marker-end', $$props.markerEnd);
			set_style(path_1, $$props.style);
		});

		append($$anchor, fragment);
	}

	function BezierEdge($$anchor, $$props) {
		push($$props, true);

		let $$d = user_derived(() => getBezierPath({
				sourceX: $$props.sourceX,
				sourceY: $$props.sourceY,
				targetX: $$props.targetX,
				targetY: $$props.targetY,
				sourcePosition: $$props.sourcePosition,
				targetPosition: $$props.targetPosition,
				curvature: $$props.pathOptions?.curvature
			})),
			$$array = user_derived(() => to_array(get$2($$d), 3)),
			path = user_derived(() => get$2($$array)[0]),
			labelX = user_derived(() => get$2($$array)[1]),
			labelY = user_derived(() => get$2($$array)[2]);

		BaseEdge($$anchor, {
			get id() {
				return $$props.id;
			},

			get path() {
				return get$2(path);
			},

			get labelX() {
				return get$2(labelX);
			},

			get labelY() {
				return get$2(labelY);
			},

			get label() {
				return $$props.label;
			},

			get labelStyle() {
				return $$props.labelStyle;
			},

			get markerStart() {
				return $$props.markerStart;
			},

			get markerEnd() {
				return $$props.markerEnd;
			},

			get interactionWidth() {
				return $$props.interactionWidth;
			},

			get style() {
				return $$props.style;
			}
		});

		pop();
	}

	function SmoothStepEdgeInternal($$anchor, $$props) {
		push($$props, true);

		let $$d = user_derived(() => getSmoothStepPath({
				sourceX: $$props.sourceX,
				sourceY: $$props.sourceY,
				targetX: $$props.targetX,
				targetY: $$props.targetY,
				sourcePosition: $$props.sourcePosition,
				targetPosition: $$props.targetPosition
			})),
			$$array = user_derived(() => to_array(get$2($$d), 3)),
			path = user_derived(() => get$2($$array)[0]),
			labelX = user_derived(() => get$2($$array)[1]),
			labelY = user_derived(() => get$2($$array)[2]);

		BaseEdge($$anchor, {
			get path() {
				return get$2(path);
			},

			get labelX() {
				return get$2(labelX);
			},

			get labelY() {
				return get$2(labelY);
			},

			get label() {
				return $$props.label;
			},

			get labelStyle() {
				return $$props.labelStyle;
			},

			get markerStart() {
				return $$props.markerStart;
			},

			get markerEnd() {
				return $$props.markerEnd;
			},

			get interactionWidth() {
				return $$props.interactionWidth;
			},

			get style() {
				return $$props.style;
			}
		});

		pop();
	}

	function StraightEdgeInternal($$anchor, $$props) {
		push($$props, true);

		let $$d = user_derived(() => getStraightPath({
				sourceX: $$props.sourceX,
				sourceY: $$props.sourceY,
				targetX: $$props.targetX,
				targetY: $$props.targetY
			})),
			$$array = user_derived(() => to_array(get$2($$d), 3)),
			path = user_derived(() => get$2($$array)[0]),
			labelX = user_derived(() => get$2($$array)[1]),
			labelY = user_derived(() => get$2($$array)[2]);

		BaseEdge($$anchor, {
			get path() {
				return get$2(path);
			},

			get labelX() {
				return get$2(labelX);
			},

			get labelY() {
				return get$2(labelY);
			},

			get label() {
				return $$props.label;
			},

			get labelStyle() {
				return $$props.labelStyle;
			},

			get markerStart() {
				return $$props.markerStart;
			},

			get markerEnd() {
				return $$props.markerEnd;
			},

			get interactionWidth() {
				return $$props.interactionWidth;
			},

			get style() {
				return $$props.style;
			}
		});

		pop();
	}

	function StepEdgeInternal($$anchor, $$props) {
		push($$props, true);

		let $$d = user_derived(() => getSmoothStepPath({
				sourceX: $$props.sourceX,
				sourceY: $$props.sourceY,
				targetX: $$props.targetX,
				targetY: $$props.targetY,
				sourcePosition: $$props.sourcePosition,
				targetPosition: $$props.targetPosition,
				borderRadius: 0
			})),
			$$array = user_derived(() => to_array(get$2($$d), 3)),
			path = user_derived(() => get$2($$array)[0]),
			labelX = user_derived(() => get$2($$array)[1]),
			labelY = user_derived(() => get$2($$array)[2]);

		BaseEdge($$anchor, {
			get path() {
				return get$2(path);
			},

			get labelX() {
				return get$2(labelX);
			},

			get labelY() {
				return get$2(labelY);
			},

			get label() {
				return $$props.label;
			},

			get labelStyle() {
				return $$props.labelStyle;
			},

			get markerStart() {
				return $$props.markerStart;
			},

			get markerEnd() {
				return $$props.markerEnd;
			},

			get interactionWidth() {
				return $$props.interactionWidth;
			},

			get style() {
				return $$props.style;
			}
		});

		pop();
	}

	/**
	 * @template T
	 */
	class ReactiveValue {
		#fn;
		#subscribe;

		/**
		 *
		 * @param {() => T} fn
		 * @param {(update: () => void) => void} onsubscribe
		 */
		constructor(fn, onsubscribe) {
			this.#fn = fn;
			this.#subscribe = createSubscriber(onsubscribe);
		}

		get current() {
			this.#subscribe();
			return this.#fn();
		}
	}

	const parenthesis_regex = /\(.+\)/;

	// these keywords are valid media queries but they need to be without parenthesis
	//
	// eg: new MediaQuery('screen')
	//
	// however because of the auto-parenthesis logic in the constructor since there's no parenthesis
	// in the media query they'll be surrounded by parenthesis
	//
	// however we can check if the media query is only composed of these keywords
	// and skip the auto-parenthesis
	//
	// https://github.com/sveltejs/svelte/issues/15930
	const non_parenthesized_keywords = new Set(['all', 'print', 'screen', 'and', 'or', 'not', 'only']);

	/**
	 * Creates a media query and provides a `current` property that reflects whether or not it matches.
	 *
	 * Use it carefully — during server-side rendering, there is no way to know what the correct value should be, potentially causing content to change upon hydration.
	 * If you can use the media query in CSS to achieve the same effect, do that.
	 *
	 * ```svelte
	 * <script>
	 * 	import { MediaQuery } from 'svelte/reactivity';
	 *
	 * 	const large = new MediaQuery('min-width: 800px');
	 * </script>
	 *
	 * <h1>{large.current ? 'large screen' : 'small screen'}</h1>
	 * ```
	 * @extends {ReactiveValue<boolean>}
	 * @since 5.7.0
	 */
	class MediaQuery extends ReactiveValue {
		/**
		 * @param {string} query A media query string
		 * @param {boolean} [fallback] Fallback value for the server
		 */
		constructor(query, fallback) {
			let final_query =
				parenthesis_regex.test(query) ||
				// we need to use `some` here because technically this `window.matchMedia('random,screen')` still returns true
				query.split(/[\s,]+/).some((keyword) => non_parenthesized_keywords.has(keyword.trim()))
					? query
					: `(${query})`;
			const q = window.matchMedia(final_query);
			super(
				() => q.matches,
				(update) => on(q, 'change', update)
			);
		}
	}

	function getVisibleNodes(nodeLookup, transform, width, height) {
	    const visibleNodes = new Map();
	    getNodesInside(nodeLookup, { x: 0, y: 0, width: width, height: height }, transform, true).forEach((node) => {
	        visibleNodes.set(node.id, node);
	    });
	    return visibleNodes;
	}
	function getLayoutedEdges(options) {
	    const { edges, defaultEdgeOptions, nodeLookup, previousEdges, connectionMode, onerror, onlyRenderVisible, elevateEdgesOnSelect, zIndexMode } = options;
	    const layoutedEdges = new Map();
	    for (const edge of edges) {
	        const sourceNode = nodeLookup.get(edge.source);
	        const targetNode = nodeLookup.get(edge.target);
	        if (!sourceNode || !targetNode) {
	            continue;
	        }
	        if (onlyRenderVisible) {
	            const { visibleNodes, transform, width, height } = options;
	            if (isEdgeVisible({
	                sourceNode,
	                targetNode,
	                width: width,
	                height: height,
	                transform: transform
	            })) {
	                visibleNodes.set(sourceNode.id, sourceNode);
	                visibleNodes.set(targetNode.id, targetNode);
	            }
	            else {
	                continue;
	            }
	        }
	        // we reuse the previous edge object if
	        // the current and previous edge are the same
	        // and the source and target node are the same
	        // and references to internalNodes are the same
	        const previous = previousEdges.get(edge.id);
	        if (previous &&
	            edge === previous.edge &&
	            sourceNode == previous.sourceNode &&
	            targetNode == previous.targetNode) {
	            layoutedEdges.set(edge.id, previous);
	            continue;
	        }
	        const edgePosition = getEdgePosition({
	            id: edge.id,
	            sourceNode,
	            targetNode,
	            sourceHandle: edge.sourceHandle || null,
	            targetHandle: edge.targetHandle || null,
	            connectionMode,
	            onError: onerror
	        });
	        if (edgePosition) {
	            layoutedEdges.set(edge.id, {
	                ...defaultEdgeOptions,
	                ...edge,
	                ...edgePosition,
	                zIndex: getElevatedEdgeZIndex({
	                    selected: edge.selected,
	                    zIndex: edge.zIndex ?? defaultEdgeOptions.zIndex,
	                    sourceNode,
	                    targetNode,
	                    elevateOnSelect: elevateEdgesOnSelect,
	                    zIndexMode
	                }),
	                sourceNode,
	                targetNode,
	                edge
	            });
	        }
	    }
	    return layoutedEdges;
	}

	/* initial-store.svelte.js generated by Svelte v5.50.3 */

	const initialNodeTypes = {
		input: InputNode,
		output: OutputNode,
		default: DefaultNode,
		group: GroupNode
	};

	const initialEdgeTypes = {
		straight: StraightEdgeInternal,
		smoothstep: SmoothStepEdgeInternal,
		default: BezierEdge,
		step: StepEdgeInternal
	};

	function getInitialViewport(
		_nodesInitialized,
		fitView,
		initialViewport,
		width,
		height,
		nodeLookup
	) {
		if (fitView && !initialViewport && width && height) {
			const bounds = getInternalNodesBounds(nodeLookup, {
				filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
			});

			return getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
		} else {
			return initialViewport ?? { x: 0, y: 0, zoom: 1 };
		}
	}

	function getInitialStore(signals) {
		// We use a class here, because Svelte adds getters & setter for us.
		// Inline classes have some performance implications but we just call it once (max twice).
		class SvelteFlowStore {
			#flowId = user_derived(() => signals.props.id ?? '1');

			get flowId() {
				return get$2(this.#flowId);
			}

			set flowId(value) {
				set$2(this.#flowId, value);
			}

			#domNode = state(null);

			get domNode() {
				return get$2(this.#domNode);
			}

			set domNode(value) {
				set$2(this.#domNode, value);
			}

			#panZoom = state(null);

			get panZoom() {
				return get$2(this.#panZoom);
			}

			set panZoom(value) {
				set$2(this.#panZoom, value);
			}

			#width = state(signals.width ?? 0);

			get width() {
				return get$2(this.#width);
			}

			set width(value) {
				set$2(this.#width, value);
			}

			#height = state(signals.height ?? 0);

			get height() {
				return get$2(this.#height);
			}

			set height(value) {
				set$2(this.#height, value);
			}

			#zIndexMode = state(signals.props.zIndexMode ?? 'basic');

			get zIndexMode() {
				return get$2(this.#zIndexMode);
			}

			set zIndexMode(value) {
				set$2(this.#zIndexMode, value);
			}

			#nodesInitialized = user_derived(() => {
				const nodesInitialized = adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
					nodeExtent: this.nodeExtent,
					nodeOrigin: this.nodeOrigin,
					elevateNodesOnSelect: signals.props.elevateNodesOnSelect ?? true,
					checkEquality: true,
					zIndexMode: this.zIndexMode
				});

				if (this.fitViewQueued && nodesInitialized) {
					if (this.fitViewOptions?.duration) {
						this.resolveFitView();
					} else {
						/**
						 * When no duration is set, viewport is set immediately which prevents an update
						 * I do not understand why, however we are setting state in a derived which is a no-go
						 */
						queueMicrotask(() => {
							this.resolveFitView();
						});
					}
				}

				return nodesInitialized;
			});

			get nodesInitialized() {
				return get$2(this.#nodesInitialized);
			}

			set nodesInitialized(value) {
				set$2(this.#nodesInitialized, value);
			}

			#viewportInitialized = user_derived(() => this.panZoom !== null);

			get viewportInitialized() {
				return get$2(this.#viewportInitialized);
			}

			set viewportInitialized(value) {
				set$2(this.#viewportInitialized, value);
			}

			#_edges = user_derived(() => {
				updateConnectionLookup(this.connectionLookup, this.edgeLookup, signals.edges);

				return signals.edges;
			});

			get _edges() {
				return get$2(this.#_edges);
			}

			set _edges(value) {
				set$2(this.#_edges, value);
			}

			get nodes() {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				this.nodesInitialized;

				return signals.nodes;
			}

			set nodes(nodes) {
				signals.nodes = nodes;
			}

			get edges() {
				return this._edges;
			}

			set edges(edges) {
				signals.edges = edges;
			}

			_prevSelectedNodes = [];
			_prevSelectedNodeIds = new Set();

			#selectedNodes = user_derived(() => {
				const selectedNodesCount = this._prevSelectedNodeIds.size;
				const selectedNodeIds = new Set();

				const selectedNodes = this.nodes.filter((node) => {
					if (node.selected) {
						selectedNodeIds.add(node.id);
						this._prevSelectedNodeIds.delete(node.id);
					}

					return node.selected;
				});

				// Either the number of selected nodes has changed or two nodes changed their selection state
				// at the same time. However then the previously selected node will be inside _prevSelectedNodeIds
				if (selectedNodesCount !== selectedNodeIds.size || this._prevSelectedNodeIds.size > 0) {
					this._prevSelectedNodes = selectedNodes;
				}

				this._prevSelectedNodeIds = selectedNodeIds;

				return this._prevSelectedNodes;
			});

			get selectedNodes() {
				return get$2(this.#selectedNodes);
			}

			set selectedNodes(value) {
				set$2(this.#selectedNodes, value);
			}

			_prevSelectedEdges = [];
			_prevSelectedEdgeIds = new Set();

			#selectedEdges = user_derived(() => {
				const selectedEdgesCount = this._prevSelectedEdgeIds.size;
				const selectedEdgeIds = new Set();

				const selectedEdges = this.edges.filter((edge) => {
					if (edge.selected) {
						selectedEdgeIds.add(edge.id);
						this._prevSelectedEdgeIds.delete(edge.id);
					}

					return edge.selected;
				});

				// Either the number of selected edges has changed or two edges changed their selection state
				// at the same time. However then the previously selected edge will be inside _prevSelectedEdgeIds
				if (selectedEdgesCount !== selectedEdgeIds.size || this._prevSelectedEdgeIds.size > 0) {
					this._prevSelectedEdges = selectedEdges;
				}

				this._prevSelectedEdgeIds = selectedEdgeIds;

				return this._prevSelectedEdges;
			});

			get selectedEdges() {
				return get$2(this.#selectedEdges);
			}

			set selectedEdges(value) {
				set$2(this.#selectedEdges, value);
			}

			selectionChangeHandlers = new Map();
			nodeLookup = new Map();
			parentLookup = new Map();
			connectionLookup = new Map();
			edgeLookup = new Map();
			_prevVisibleEdges = new Map();

			#visible = user_derived(() => {
				const {
					// We need to access this._nodes to trigger on changes
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					nodes,
					_edges: edges,
					_prevVisibleEdges: previousEdges,
					nodeLookup,
					connectionMode,
					onerror,
					onlyRenderVisibleElements,
					defaultEdgeOptions,
					zIndexMode
				} = this;

				let visibleNodes;
				let visibleEdges;

				const options = {
					edges,
					defaultEdgeOptions,
					previousEdges,
					nodeLookup,
					connectionMode,
					elevateEdgesOnSelect: signals.props.elevateEdgesOnSelect ?? true,
					zIndexMode,
					onerror
				};

				if (onlyRenderVisibleElements) {
					// We only subscribe to viewport, width, height if onlyRenderVisibleElements is true
					const { viewport, width, height } = this;

					const transform = [viewport.x, viewport.y, viewport.zoom];

					visibleNodes = getVisibleNodes(nodeLookup, transform, width, height);

					visibleEdges = getLayoutedEdges({
						...options,
						onlyRenderVisible: true,
						visibleNodes,
						transform,
						width,
						height
					});
				} else {
					visibleNodes = this.nodeLookup;
					visibleEdges = getLayoutedEdges(options);
				}

				return { nodes: visibleNodes, edges: visibleEdges };
			});

			get visible() {
				return get$2(this.#visible);
			}

			set visible(value) {
				set$2(this.#visible, value);
			}

			#nodesDraggable = user_derived(() => signals.props.nodesDraggable ?? true);

			get nodesDraggable() {
				return get$2(this.#nodesDraggable);
			}

			set nodesDraggable(value) {
				set$2(this.#nodesDraggable, value);
			}

			#nodesConnectable = user_derived(() => signals.props.nodesConnectable ?? true);

			get nodesConnectable() {
				return get$2(this.#nodesConnectable);
			}

			set nodesConnectable(value) {
				set$2(this.#nodesConnectable, value);
			}

			#elementsSelectable = user_derived(() => signals.props.elementsSelectable ?? true);

			get elementsSelectable() {
				return get$2(this.#elementsSelectable);
			}

			set elementsSelectable(value) {
				set$2(this.#elementsSelectable, value);
			}

			#nodesFocusable = user_derived(() => signals.props.nodesFocusable ?? true);

			get nodesFocusable() {
				return get$2(this.#nodesFocusable);
			}

			set nodesFocusable(value) {
				set$2(this.#nodesFocusable, value);
			}

			#edgesFocusable = user_derived(() => signals.props.edgesFocusable ?? true);

			get edgesFocusable() {
				return get$2(this.#edgesFocusable);
			}

			set edgesFocusable(value) {
				set$2(this.#edgesFocusable, value);
			}

			#disableKeyboardA11y = user_derived(() => signals.props.disableKeyboardA11y ?? false);

			get disableKeyboardA11y() {
				return get$2(this.#disableKeyboardA11y);
			}

			set disableKeyboardA11y(value) {
				set$2(this.#disableKeyboardA11y, value);
			}

			#minZoom = user_derived(() => signals.props.minZoom ?? 0.5);

			get minZoom() {
				return get$2(this.#minZoom);
			}

			set minZoom(value) {
				set$2(this.#minZoom, value);
			}

			#maxZoom = user_derived(() => signals.props.maxZoom ?? 2);

			get maxZoom() {
				return get$2(this.#maxZoom);
			}

			set maxZoom(value) {
				set$2(this.#maxZoom, value);
			}

			#nodeOrigin = user_derived(() => signals.props.nodeOrigin ?? [0, 0]);

			get nodeOrigin() {
				return get$2(this.#nodeOrigin);
			}

			set nodeOrigin(value) {
				set$2(this.#nodeOrigin, value);
			}

			#nodeExtent = user_derived(() => signals.props.nodeExtent ?? infiniteExtent);

			get nodeExtent() {
				return get$2(this.#nodeExtent);
			}

			set nodeExtent(value) {
				set$2(this.#nodeExtent, value);
			}

			#translateExtent = user_derived(() => signals.props.translateExtent ?? infiniteExtent);

			get translateExtent() {
				return get$2(this.#translateExtent);
			}

			set translateExtent(value) {
				set$2(this.#translateExtent, value);
			}

			#defaultEdgeOptions = user_derived(() => signals.props.defaultEdgeOptions ?? {});

			get defaultEdgeOptions() {
				return get$2(this.#defaultEdgeOptions);
			}

			set defaultEdgeOptions(value) {
				set$2(this.#defaultEdgeOptions, value);
			}

			#nodeDragThreshold = user_derived(() => signals.props.nodeDragThreshold ?? 1);

			get nodeDragThreshold() {
				return get$2(this.#nodeDragThreshold);
			}

			set nodeDragThreshold(value) {
				set$2(this.#nodeDragThreshold, value);
			}

			#autoPanOnNodeDrag = user_derived(() => signals.props.autoPanOnNodeDrag ?? true);

			get autoPanOnNodeDrag() {
				return get$2(this.#autoPanOnNodeDrag);
			}

			set autoPanOnNodeDrag(value) {
				set$2(this.#autoPanOnNodeDrag, value);
			}

			#autoPanOnConnect = user_derived(() => signals.props.autoPanOnConnect ?? true);

			get autoPanOnConnect() {
				return get$2(this.#autoPanOnConnect);
			}

			set autoPanOnConnect(value) {
				set$2(this.#autoPanOnConnect, value);
			}

			#autoPanOnNodeFocus = user_derived(() => signals.props.autoPanOnNodeFocus ?? true);

			get autoPanOnNodeFocus() {
				return get$2(this.#autoPanOnNodeFocus);
			}

			set autoPanOnNodeFocus(value) {
				set$2(this.#autoPanOnNodeFocus, value);
			}

			#autoPanSpeed = user_derived(() => signals.props.autoPanSpeed ?? 15);

			get autoPanSpeed() {
				return get$2(this.#autoPanSpeed);
			}

			set autoPanSpeed(value) {
				set$2(this.#autoPanSpeed, value);
			}

			#connectionDragThreshold = user_derived(() => signals.props.connectionDragThreshold ?? 1);

			get connectionDragThreshold() {
				return get$2(this.#connectionDragThreshold);
			}

			set connectionDragThreshold(value) {
				set$2(this.#connectionDragThreshold, value);
			}

			fitViewQueued = signals.props.fitView ?? false;
			fitViewOptions = signals.props.fitViewOptions;
			fitViewResolver = null;
			#snapGrid = user_derived(() => signals.props.snapGrid ?? null);

			get snapGrid() {
				return get$2(this.#snapGrid);
			}

			set snapGrid(value) {
				set$2(this.#snapGrid, value);
			}

			#dragging = state(false);

			get dragging() {
				return get$2(this.#dragging);
			}

			set dragging(value) {
				set$2(this.#dragging, value);
			}

			#selectionRect = state(null);

			get selectionRect() {
				return get$2(this.#selectionRect);
			}

			set selectionRect(value) {
				set$2(this.#selectionRect, value);
			}

			#selectionKeyPressed = state(false);

			get selectionKeyPressed() {
				return get$2(this.#selectionKeyPressed);
			}

			set selectionKeyPressed(value) {
				set$2(this.#selectionKeyPressed, value);
			}

			#multiselectionKeyPressed = state(false);

			get multiselectionKeyPressed() {
				return get$2(this.#multiselectionKeyPressed);
			}

			set multiselectionKeyPressed(value) {
				set$2(this.#multiselectionKeyPressed, value);
			}

			#deleteKeyPressed = state(false);

			get deleteKeyPressed() {
				return get$2(this.#deleteKeyPressed);
			}

			set deleteKeyPressed(value) {
				set$2(this.#deleteKeyPressed, value);
			}

			#panActivationKeyPressed = state(false);

			get panActivationKeyPressed() {
				return get$2(this.#panActivationKeyPressed);
			}

			set panActivationKeyPressed(value) {
				set$2(this.#panActivationKeyPressed, value);
			}

			#zoomActivationKeyPressed = state(false);

			get zoomActivationKeyPressed() {
				return get$2(this.#zoomActivationKeyPressed);
			}

			set zoomActivationKeyPressed(value) {
				set$2(this.#zoomActivationKeyPressed, value);
			}

			#selectionRectMode = state(null);

			get selectionRectMode() {
				return get$2(this.#selectionRectMode);
			}

			set selectionRectMode(value) {
				set$2(this.#selectionRectMode, value);
			}

			#ariaLiveMessage = state('');

			get ariaLiveMessage() {
				return get$2(this.#ariaLiveMessage);
			}

			set ariaLiveMessage(value) {
				set$2(this.#ariaLiveMessage, value);
			}

			#selectionMode = user_derived(() => signals.props.selectionMode ?? SelectionMode.Partial);

			get selectionMode() {
				return get$2(this.#selectionMode);
			}

			set selectionMode(value) {
				set$2(this.#selectionMode, value);
			}

			#nodeTypes = user_derived(() => ({ ...initialNodeTypes, ...signals.props.nodeTypes }));

			get nodeTypes() {
				return get$2(this.#nodeTypes);
			}

			set nodeTypes(value) {
				set$2(this.#nodeTypes, value);
			}

			#edgeTypes = user_derived(() => ({ ...initialEdgeTypes, ...signals.props.edgeTypes }));

			get edgeTypes() {
				return get$2(this.#edgeTypes);
			}

			set edgeTypes(value) {
				set$2(this.#edgeTypes, value);
			}

			#noPanClass = user_derived(() => signals.props.noPanClass ?? 'nopan');

			get noPanClass() {
				return get$2(this.#noPanClass);
			}

			set noPanClass(value) {
				set$2(this.#noPanClass, value);
			}

			#noDragClass = user_derived(() => signals.props.noDragClass ?? 'nodrag');

			get noDragClass() {
				return get$2(this.#noDragClass);
			}

			set noDragClass(value) {
				set$2(this.#noDragClass, value);
			}

			#noWheelClass = user_derived(() => signals.props.noWheelClass ?? 'nowheel');

			get noWheelClass() {
				return get$2(this.#noWheelClass);
			}

			set noWheelClass(value) {
				set$2(this.#noWheelClass, value);
			}

			#ariaLabelConfig = user_derived(() => mergeAriaLabelConfig(signals.props.ariaLabelConfig));

			get ariaLabelConfig() {
				return get$2(this.#ariaLabelConfig);
			}

			set ariaLabelConfig(value) {
				set$2(this.#ariaLabelConfig, value);
			}

			#_viewport = state(getInitialViewport(this.nodesInitialized, signals.props.fitView, signals.props.initialViewport, this.width, this.height, this.nodeLookup));

			get _viewport() {
				return get$2(this.#_viewport);
			}

			set _viewport(value) {
				set$2(this.#_viewport, value);
			}

			get viewport() {
				return signals.viewport ?? this._viewport;
			}

			set viewport(newViewport) {
				if (signals.viewport) {
					signals.viewport = newViewport;
				}

				this._viewport = newViewport;
			}

			#_connection = // _connection is viewport independent and originating from XYHandle
			state(initialConnection);

			get _connection() {
				return get$2(this.#_connection);
			}

			set _connection(value) {
				set$2(this.#_connection, value);
			}

			#connection = user_derived(() => {
				if (!this._connection.inProgress) {
					return this._connection;
				}

				return {
					...this._connection,
					to: pointToRendererPoint(this._connection.to, [this.viewport.x, this.viewport.y, this.viewport.zoom])
				};
			});

			get connection() {
				return get$2(this.#connection);
			}

			set connection(value) {
				set$2(this.#connection, value);
			}

			#connectionMode = user_derived(() => signals.props.connectionMode ?? ConnectionMode.Strict);

			get connectionMode() {
				return get$2(this.#connectionMode);
			}

			set connectionMode(value) {
				set$2(this.#connectionMode, value);
			}

			#connectionRadius = user_derived(() => signals.props.connectionRadius ?? 20);

			get connectionRadius() {
				return get$2(this.#connectionRadius);
			}

			set connectionRadius(value) {
				set$2(this.#connectionRadius, value);
			}

			#isValidConnection = user_derived(() => signals.props.isValidConnection ?? (() => true));

			get isValidConnection() {
				return get$2(this.#isValidConnection);
			}

			set isValidConnection(value) {
				set$2(this.#isValidConnection, value);
			}

			#selectNodesOnDrag = user_derived(() => signals.props.selectNodesOnDrag ?? true);

			get selectNodesOnDrag() {
				return get$2(this.#selectNodesOnDrag);
			}

			set selectNodesOnDrag(value) {
				set$2(this.#selectNodesOnDrag, value);
			}

			#defaultMarkerColor = user_derived(() => signals.props.defaultMarkerColor === undefined ? '#b1b1b7' : signals.props.defaultMarkerColor);

			get defaultMarkerColor() {
				return get$2(this.#defaultMarkerColor);
			}

			set defaultMarkerColor(value) {
				set$2(this.#defaultMarkerColor, value);
			}

			#markers = user_derived(() => {
				return createMarkerIds(signals.edges, {
					defaultColor: this.defaultMarkerColor,
					id: this.flowId,
					defaultMarkerStart: this.defaultEdgeOptions.markerStart,
					defaultMarkerEnd: this.defaultEdgeOptions.markerEnd
				});
			});

			get markers() {
				return get$2(this.#markers);
			}

			set markers(value) {
				set$2(this.#markers, value);
			}

			#onlyRenderVisibleElements = user_derived(() => signals.props.onlyRenderVisibleElements ?? false);

			get onlyRenderVisibleElements() {
				return get$2(this.#onlyRenderVisibleElements);
			}

			set onlyRenderVisibleElements(value) {
				set$2(this.#onlyRenderVisibleElements, value);
			}

			#onerror = user_derived(() => signals.props.onflowerror ?? devWarn);

			get onerror() {
				return get$2(this.#onerror);
			}

			set onerror(value) {
				set$2(this.#onerror, value);
			}

			#ondelete = user_derived(() => signals.props.ondelete);

			get ondelete() {
				return get$2(this.#ondelete);
			}

			set ondelete(value) {
				set$2(this.#ondelete, value);
			}

			#onbeforedelete = user_derived(() => signals.props.onbeforedelete);

			get onbeforedelete() {
				return get$2(this.#onbeforedelete);
			}

			set onbeforedelete(value) {
				set$2(this.#onbeforedelete, value);
			}

			#onbeforeconnect = user_derived(() => signals.props.onbeforeconnect);

			get onbeforeconnect() {
				return get$2(this.#onbeforeconnect);
			}

			set onbeforeconnect(value) {
				set$2(this.#onbeforeconnect, value);
			}

			#onconnect = user_derived(() => signals.props.onconnect);

			get onconnect() {
				return get$2(this.#onconnect);
			}

			set onconnect(value) {
				set$2(this.#onconnect, value);
			}

			#onconnectstart = user_derived(() => signals.props.onconnectstart);

			get onconnectstart() {
				return get$2(this.#onconnectstart);
			}

			set onconnectstart(value) {
				set$2(this.#onconnectstart, value);
			}

			#onconnectend = user_derived(() => signals.props.onconnectend);

			get onconnectend() {
				return get$2(this.#onconnectend);
			}

			set onconnectend(value) {
				set$2(this.#onconnectend, value);
			}

			#onbeforereconnect = user_derived(() => signals.props.onbeforereconnect);

			get onbeforereconnect() {
				return get$2(this.#onbeforereconnect);
			}

			set onbeforereconnect(value) {
				set$2(this.#onbeforereconnect, value);
			}

			#onreconnect = user_derived(() => signals.props.onreconnect);

			get onreconnect() {
				return get$2(this.#onreconnect);
			}

			set onreconnect(value) {
				set$2(this.#onreconnect, value);
			}

			#onreconnectstart = user_derived(() => signals.props.onreconnectstart);

			get onreconnectstart() {
				return get$2(this.#onreconnectstart);
			}

			set onreconnectstart(value) {
				set$2(this.#onreconnectstart, value);
			}

			#onreconnectend = user_derived(() => signals.props.onreconnectend);

			get onreconnectend() {
				return get$2(this.#onreconnectend);
			}

			set onreconnectend(value) {
				set$2(this.#onreconnectend, value);
			}

			#clickConnect = user_derived(() => signals.props.clickConnect ?? true);

			get clickConnect() {
				return get$2(this.#clickConnect);
			}

			set clickConnect(value) {
				set$2(this.#clickConnect, value);
			}

			#onclickconnectstart = user_derived(() => signals.props.onclickconnectstart);

			get onclickconnectstart() {
				return get$2(this.#onclickconnectstart);
			}

			set onclickconnectstart(value) {
				set$2(this.#onclickconnectstart, value);
			}

			#onclickconnectend = user_derived(() => signals.props.onclickconnectend);

			get onclickconnectend() {
				return get$2(this.#onclickconnectend);
			}

			set onclickconnectend(value) {
				set$2(this.#onclickconnectend, value);
			}

			#clickConnectStartHandle = state(null);

			get clickConnectStartHandle() {
				return get$2(this.#clickConnectStartHandle);
			}

			set clickConnectStartHandle(value) {
				set$2(this.#clickConnectStartHandle, value);
			}

			#onselectiondrag = user_derived(() => signals.props.onselectiondrag);

			get onselectiondrag() {
				return get$2(this.#onselectiondrag);
			}

			set onselectiondrag(value) {
				set$2(this.#onselectiondrag, value);
			}

			#onselectiondragstart = user_derived(() => signals.props.onselectiondragstart);

			get onselectiondragstart() {
				return get$2(this.#onselectiondragstart);
			}

			set onselectiondragstart(value) {
				set$2(this.#onselectiondragstart, value);
			}

			#onselectiondragstop = user_derived(() => signals.props.onselectiondragstop);

			get onselectiondragstop() {
				return get$2(this.#onselectiondragstop);
			}

			set onselectiondragstop(value) {
				set$2(this.#onselectiondragstop, value);
			}

			resolveFitView = async () => {
				if (!this.panZoom) {
					return;
				}

				await fitViewport(
					{
						nodes: this.nodeLookup,
						width: this.width,
						height: this.height,
						panZoom: this.panZoom,
						minZoom: this.minZoom,
						maxZoom: this.maxZoom
					},
					this.fitViewOptions
				);

				this.fitViewResolver?.resolve(true);

				/**
				 * wait for the fitViewport to resolve before deleting the resolver,
				 * we want to reuse the old resolver if the user calls fitView again in the mean time
				 */
				this.fitViewQueued = false;

				this.fitViewOptions = undefined;
				this.fitViewResolver = null;
			};

			_prefersDark = new MediaQuery('(prefers-color-scheme: dark)', signals.props.colorModeSSR === 'dark');

			#colorMode = user_derived(() => signals.props.colorMode === 'system'
				? this._prefersDark.current ? 'dark' : 'light'
				: signals.props.colorMode ?? 'light');

			get colorMode() {
				return get$2(this.#colorMode);
			}

			set colorMode(value) {
				set$2(this.#colorMode, value);
			}

			constructor() {
				if (process.env.NODE_ENV === 'development') {
					warnIfDeeplyReactive(signals.nodes, 'nodes');
					warnIfDeeplyReactive(signals.edges, 'edges');
				}
			}

			resetStoreValues() {
				this.dragging = false;
				this.selectionRect = null;
				this.selectionRectMode = null;
				this.selectionKeyPressed = false;
				this.multiselectionKeyPressed = false;
				this.deleteKeyPressed = false;
				this.panActivationKeyPressed = false;
				this.zoomActivationKeyPressed = false;
				this._connection = initialConnection;
				this.clickConnectStartHandle = null;
				this.viewport = signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 };
				this.ariaLiveMessage = '';
			}
		}

		return new SvelteFlowStore();
	}

	// Only way to check if an object is a proxy
	// is to see if is failes to perform a structured clone
	function warnIfDeeplyReactive(array, name) {
		try {
			if (array && array.length > 0) {
				structuredClone(array[0]);
			}
		} catch {
			console.warn(`Use $state.raw for ${name} to prevent performance issues.`);
		}
	}

	function useStore() {
	    const storeContext = getContext(key);
	    if (!storeContext) {
	        throw new Error('To call useStore outside of <SvelteFlow /> you need to wrap your component in a <SvelteFlowProvider />');
	    }
	    return storeContext.getStore();
	}

	const key = Symbol();
	function createStore(signals) {
	    const store = getInitialStore(signals);
	    function setNodeTypes(nodeTypes) {
	        store.nodeTypes = {
	            ...initialNodeTypes,
	            ...nodeTypes
	        };
	    }
	    function setEdgeTypes(edgeTypes) {
	        store.edgeTypes = {
	            ...initialEdgeTypes,
	            ...edgeTypes
	        };
	    }
	    function addEdge$1(edgeParams) {
	        store.edges = addEdge(edgeParams, store.edges);
	    }
	    const updateNodePositions = (nodeDragItems, dragging = false) => {
	        store.nodes = store.nodes.map((node) => {
	            if (store.connection.inProgress && store.connection.fromNode.id === node.id) {
	                const internalNode = store.nodeLookup.get(node.id);
	                if (internalNode) {
	                    store.connection = {
	                        ...store.connection,
	                        from: getHandlePosition(internalNode, store.connection.fromHandle, Position.Left, true)
	                    };
	                }
	            }
	            const dragItem = nodeDragItems.get(node.id);
	            return dragItem ? { ...node, position: dragItem.position, dragging } : node;
	        });
	    };
	    function updateNodeInternals$1(updates) {
	        const { changes, updatedInternals } = updateNodeInternals(updates, store.nodeLookup, store.parentLookup, store.domNode, store.nodeOrigin, store.nodeExtent, store.zIndexMode);
	        if (!updatedInternals) {
	            return;
	        }
	        updateAbsolutePositions(store.nodeLookup, store.parentLookup, {
	            nodeOrigin: store.nodeOrigin,
	            nodeExtent: store.nodeExtent,
	            zIndexMode: store.zIndexMode
	        });
	        if (store.fitViewQueued) {
	            store.resolveFitView();
	        }
	        const newNodes = new Map();
	        for (const change of changes) {
	            const userNode = store.nodeLookup.get(change.id)?.internals.userNode;
	            if (!userNode) {
	                continue;
	            }
	            const node = { ...userNode };
	            switch (change.type) {
	                case 'dimensions': {
	                    const measured = { ...node.measured, ...change.dimensions };
	                    if (change.setAttributes) {
	                        node.width = change.dimensions?.width ?? node.width;
	                        node.height = change.dimensions?.height ?? node.height;
	                    }
	                    node.measured = measured;
	                    break;
	                }
	                case 'position':
	                    node.position = change.position ?? node.position;
	                    break;
	            }
	            newNodes.set(change.id, node);
	        }
	        store.nodes = store.nodes.map((node) => newNodes.get(node.id) ?? node);
	    }
	    function fitView(options) {
	        // We either create a new Promise or reuse the existing one
	        // Even if fitView is called multiple times in a row, we only end up with a single Promise
	        const fitViewResolver = store.fitViewResolver ?? Promise.withResolvers();
	        // We schedule a fitView by setting fitViewQueued and triggering a setNodes
	        store.fitViewQueued = true;
	        store.fitViewOptions = options;
	        store.fitViewResolver = fitViewResolver;
	        // We need to update the nodes so that adoptUserNodes is triggered
	        store.nodes = [...store.nodes];
	        return fitViewResolver.promise;
	    }
	    async function setCenter(x, y, options) {
	        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : store.maxZoom;
	        const currentPanZoom = store.panZoom;
	        if (!currentPanZoom) {
	            return Promise.resolve(false);
	        }
	        await currentPanZoom.setViewport({
	            x: store.width / 2 - x * nextZoom,
	            y: store.height / 2 - y * nextZoom,
	            zoom: nextZoom
	        }, { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate });
	        return Promise.resolve(true);
	    }
	    function zoomBy(factor, options) {
	        const panZoom = store.panZoom;
	        if (!panZoom) {
	            return Promise.resolve(false);
	        }
	        return panZoom.scaleBy(factor, options);
	    }
	    function zoomIn(options) {
	        return zoomBy(1.2, options);
	    }
	    function zoomOut(options) {
	        return zoomBy(1 / 1.2, options);
	    }
	    function setMinZoom(minZoom) {
	        const panZoom = store.panZoom;
	        if (panZoom) {
	            panZoom.setScaleExtent([minZoom, store.maxZoom]);
	            store.minZoom = minZoom;
	        }
	    }
	    function setMaxZoom(maxZoom) {
	        const panZoom = store.panZoom;
	        if (panZoom) {
	            panZoom.setScaleExtent([store.minZoom, maxZoom]);
	            store.maxZoom = maxZoom;
	        }
	    }
	    function setTranslateExtent(extent) {
	        const panZoom = store.panZoom;
	        if (panZoom) {
	            panZoom.setTranslateExtent(extent);
	            store.translateExtent = extent;
	        }
	    }
	    function deselect(elements, elementsToDeselect = null) {
	        let deselected = false;
	        const newElements = elements.map((element) => {
	            const shouldDeselect = elementsToDeselect ? elementsToDeselect.has(element.id) : true;
	            if (shouldDeselect && element.selected) {
	                deselected = true;
	                return { ...element, selected: false };
	            }
	            return element;
	        });
	        return [deselected, newElements];
	    }
	    function unselectNodesAndEdges(params) {
	        const nodesToDeselect = params?.nodes ? new Set(params.nodes.map((node) => node.id)) : null;
	        const [nodesDeselected, newNodes] = deselect(store.nodes, nodesToDeselect);
	        if (nodesDeselected) {
	            store.nodes = newNodes;
	        }
	        const edgesToDeselect = params?.edges ? new Set(params.edges.map((node) => node.id)) : null;
	        const [edgesDeselected, newEdges] = deselect(store.edges, edgesToDeselect);
	        if (edgesDeselected) {
	            store.edges = newEdges;
	        }
	    }
	    function addSelectedNodes(ids) {
	        const isMultiSelection = store.multiselectionKeyPressed;
	        store.nodes = store.nodes.map((node) => {
	            const nodeWillBeSelected = ids.includes(node.id);
	            const selected = isMultiSelection ? node.selected || nodeWillBeSelected : nodeWillBeSelected;
	            if (!!node.selected !== selected) {
	                return { ...node, selected };
	            }
	            return node;
	        });
	        if (!isMultiSelection) {
	            unselectNodesAndEdges({ nodes: [] });
	        }
	    }
	    function addSelectedEdges(ids) {
	        const isMultiSelection = store.multiselectionKeyPressed;
	        store.edges = store.edges.map((edge) => {
	            const edgeWillBeSelected = ids.includes(edge.id);
	            const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;
	            if (!!edge.selected !== selected) {
	                return { ...edge, selected };
	            }
	            return edge;
	        });
	        if (!isMultiSelection) {
	            unselectNodesAndEdges({ edges: [] });
	        }
	    }
	    function handleNodeSelection(id, unselect, nodeRef) {
	        const node = store.nodeLookup.get(id);
	        if (!node) {
	            console.warn('012', errorMessages['error012'](id));
	            return;
	        }
	        store.selectionRect = null;
	        store.selectionRectMode = null;
	        if (!node.selected) {
	            addSelectedNodes([id]);
	        }
	        else if (unselect || (node.selected && store.multiselectionKeyPressed)) {
	            unselectNodesAndEdges({ nodes: [node], edges: [] });
	            requestAnimationFrame(() => nodeRef?.blur());
	        }
	    }
	    function handleEdgeSelection(id) {
	        const edge = store.edgeLookup.get(id);
	        if (!edge) {
	            console.warn('012', errorMessages['error012'](id));
	            return;
	        }
	        const selectable = edge.selectable || (store.elementsSelectable && typeof edge.selectable === 'undefined');
	        if (selectable) {
	            store.selectionRect = null;
	            store.selectionRectMode = null;
	            if (!edge.selected) {
	                addSelectedEdges([id]);
	            }
	            else if (edge.selected && store.multiselectionKeyPressed) {
	                unselectNodesAndEdges({ nodes: [], edges: [edge] });
	            }
	        }
	    }
	    function moveSelectedNodes(direction, factor) {
	        const { nodeExtent, snapGrid, nodeOrigin, nodeLookup, nodesDraggable, onerror } = store;
	        const nodeUpdates = new Map();
	        /*
	         * by default a node moves 5px on each key press
	         * if snap grid is enabled, we use that for the velocity
	         */
	        const xVelo = snapGrid?.[0] ?? 5;
	        const yVelo = snapGrid?.[1] ?? 5;
	        const xDiff = direction.x * xVelo * factor;
	        const yDiff = direction.y * yVelo * factor;
	        for (const node of nodeLookup.values()) {
	            const isSelected = node.selected &&
	                (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
	            if (!isSelected) {
	                continue;
	            }
	            let nextPosition = {
	                x: node.internals.positionAbsolute.x + xDiff,
	                y: node.internals.positionAbsolute.y + yDiff
	            };
	            if (snapGrid) {
	                nextPosition = snapPosition(nextPosition, snapGrid);
	            }
	            const { position, positionAbsolute } = calculateNodePosition({
	                nodeId: node.id,
	                nextPosition,
	                nodeLookup,
	                nodeExtent,
	                nodeOrigin,
	                onError: onerror
	            });
	            node.position = position;
	            node.internals.positionAbsolute = positionAbsolute;
	            nodeUpdates.set(node.id, node);
	        }
	        updateNodePositions(nodeUpdates);
	    }
	    function panBy$1(delta) {
	        return panBy({
	            delta,
	            panZoom: store.panZoom,
	            transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
	            translateExtent: store.translateExtent,
	            width: store.width,
	            height: store.height
	        });
	    }
	    const updateConnection = (newConnection) => {
	        store._connection = { ...newConnection };
	    };
	    function cancelConnection() {
	        store._connection = initialConnection;
	    }
	    function reset() {
	        store.resetStoreValues();
	        unselectNodesAndEdges();
	    }
	    const storeWithActions = Object.assign(store, {
	        setNodeTypes,
	        setEdgeTypes,
	        addEdge: addEdge$1,
	        updateNodePositions,
	        updateNodeInternals: updateNodeInternals$1,
	        zoomIn,
	        zoomOut,
	        fitView,
	        setCenter,
	        setMinZoom,
	        setMaxZoom,
	        setTranslateExtent,
	        unselectNodesAndEdges,
	        addSelectedNodes,
	        addSelectedEdges,
	        handleNodeSelection,
	        handleEdgeSelection,
	        moveSelectedNodes,
	        panBy: panBy$1,
	        updateConnection,
	        cancelConnection,
	        reset
	    });
	    return storeWithActions;
	}

	function zoom(domNode, params) {
	    const { minZoom, maxZoom, initialViewport, onPanZoomStart, onPanZoom, onPanZoomEnd, translateExtent, setPanZoomInstance, onDraggingChange, onTransformChange } = params;
	    const panZoomInstance = XYPanZoom({
	        domNode,
	        minZoom,
	        maxZoom,
	        translateExtent,
	        viewport: initialViewport,
	        onPanZoom,
	        onPanZoomStart,
	        onPanZoomEnd,
	        onDraggingChange
	    });
	    const viewport = panZoomInstance.getViewport();
	    if (initialViewport.x !== viewport.x ||
	        initialViewport.y !== viewport.y ||
	        initialViewport.zoom !== viewport.zoom) {
	        onTransformChange([viewport.x, viewport.y, viewport.zoom]);
	    }
	    setPanZoomInstance(panZoomInstance);
	    panZoomInstance.update(params);
	    return {
	        update(params) {
	            panZoomInstance.update(params);
	        }
	    };
	}

	var root$9 = from_html(`<div class="svelte-flow__zoom svelte-flow__container"><!></div>`);

	function Zoom($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15);
		let panOnDragActive = user_derived(() => store().panActivationKeyPressed || $$props.panOnDrag);
		let panOnScrollActive = user_derived(() => store().panActivationKeyPressed || $$props.panOnScroll);

		// We extract the initial value by destructuring
		const { viewport: initialViewport } = store();

		let onInitCalled = false;

		user_effect(() => {
			if (!onInitCalled && store().viewportInitialized) {
				$$props.oninit?.();
				onInitCalled = true;
			}
		});

		var div = root$9();
		var node = child(div);

		snippet(node, () => $$props.children);

		action(div, ($$node, $$action_arg) => zoom?.($$node, $$action_arg), () => ({
			viewport: store().viewport,
			minZoom: store().minZoom,
			maxZoom: store().maxZoom,
			initialViewport,
			onDraggingChange: (dragging) => {
				store(store().dragging = dragging, true);
			},

			setPanZoomInstance: (instance) => {
				store(store().panZoom = instance, true);
			},
			onPanZoomStart: $$props.onmovestart,
			onPanZoom: $$props.onmove,
			onPanZoomEnd: $$props.onmoveend,
			zoomOnScroll: $$props.zoomOnScroll,
			zoomOnDoubleClick: $$props.zoomOnDoubleClick,
			zoomOnPinch: $$props.zoomOnPinch,
			panOnScroll: get$2(panOnScrollActive),
			panOnDrag: get$2(panOnDragActive),
			panOnScrollSpeed: $$props.panOnScrollSpeed,
			panOnScrollMode: $$props.panOnScrollMode,
			zoomActivationKeyPressed: store().zoomActivationKeyPressed,
			preventScrolling: typeof $$props.preventScrolling === 'boolean' ? $$props.preventScrolling : true,
			noPanClassName: store().noPanClass,
			noWheelClassName: store().noWheelClass,
			userSelectionActive: !!store().selectionRect,
			translateExtent: store().translateExtent,
			lib: 'svelte',
			paneClickDistance: $$props.paneClickDistance,
			selectionOnDrag: $$props.selectionOnDrag,
			onTransformChange: (transform) => {
				store(store().viewport = { x: transform[0], y: transform[1], zoom: transform[2] }, true);
			},
			connectionInProgress: store().connection.inProgress
		}));

		append($$anchor, div);
		pop();
	}

	function wrapHandler(handler, container) {
		return (event) => {
			if (event.target !== container) {
				return;
			}

			handler?.(event);
		};
	}

	function toggleSelected(ids) {
		return (item) => {
			const isSelected = ids.has(item.id);

			if (!!item.selected !== isSelected) {
				return { ...item, selected: isSelected };
			}

			return item;
		};
	}

	function isSetEqual(a, b) {
		if (a.size !== b.size) {
			return false;
		}

		for (const item of a) {
			if (!b.has(item)) {
				return false;
			}
		}

		return true;
	}

	var root$8 = from_html(`<div><!></div>`);

	function Pane($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15),
			panOnDrag = prop($$props, 'panOnDrag', 3, true),
			paneClickDistance = prop($$props, 'paneClickDistance', 3, 1);

		// svelte-ignore non_reactive_update
		let container;

		let containerBounds = null;

		/* eslint-disable svelte/prefer-svelte-reactivity */
		let selectedNodeIds = new Set();

		let selectedEdgeIds = new Set();

		/* eslint-enable svelte/prefer-svelte-reactivity */
		let panOnDragActive = user_derived(() => store().panActivationKeyPressed || panOnDrag());

		let isSelecting = user_derived(() => store().selectionKeyPressed || !!store().selectionRect || $$props.selectionOnDrag && get$2(panOnDragActive) !== true);
		let isSelectionEnabled = user_derived(() => store().elementsSelectable && (get$2(isSelecting) || store().selectionRectMode === 'user'));

		// Used to prevent click events when the user lets go of the selectionKey during a selection
		let selectionInProgress = false;

		// We start the selection process when the user clicks down on the pane
		function onPointerDownCapture(event) {
			containerBounds = container?.getBoundingClientRect();

			if (!containerBounds) return;

			const eventTargetIsContainer = event.target === container;
			const isNoKeyEvent = !eventTargetIsContainer && !!event.target.closest('.nokey');
			const isSelectionActive = $$props.selectionOnDrag && eventTargetIsContainer || store().selectionKeyPressed;

			if (isNoKeyEvent || !get$2(isSelecting) || !isSelectionActive || event.button !== 0 || !event.isPrimary) {
				return;
			}

			event.target?.setPointerCapture?.(event.pointerId);
			selectionInProgress = false;

			const { x, y } = getEventPosition(event, containerBounds);

			store(store().selectionRect = { width: 0, height: 0, startX: x, startY: y, x, y }, true);

			if (!eventTargetIsContainer) {
				event.stopPropagation();
				event.preventDefault();
			}
		}

		function onPointerMove(event) {
			if (!get$2(isSelecting) || !containerBounds || !store().selectionRect) {
				return;
			}

			const mousePos = getEventPosition(event, containerBounds);
			const { startX = 0, startY = 0 } = store().selectionRect;

			if (!selectionInProgress) {
				const requiredDistance = store().selectionKeyPressed ? 0 : paneClickDistance();
				const distance = Math.hypot(mousePos.x - startX, mousePos.y - startY);

				if (distance <= requiredDistance) {
					return;
				}

				store().unselectNodesAndEdges();
				$$props.onselectionstart?.(event);
			}

			selectionInProgress = true;

			const nextUserSelectRect = {
				...store().selectionRect,
				x: mousePos.x < startX ? mousePos.x : startX,
				y: mousePos.y < startY ? mousePos.y : startY,
				width: Math.abs(mousePos.x - startX),
				height: Math.abs(mousePos.y - startY)
			};

			const prevSelectedNodeIds = selectedNodeIds;
			const prevSelectedEdgeIds = selectedEdgeIds;

			selectedNodeIds = new Set(getNodesInside(
				store().nodeLookup,
				nextUserSelectRect,
				[
					store().viewport.x,
					store().viewport.y,
					store().viewport.zoom
				],
				store().selectionMode === SelectionMode.Partial,
				true
			).map((n) => n.id));

			const edgesSelectable = store().defaultEdgeOptions.selectable ?? true;

			selectedEdgeIds = new Set();

			// We look for all edges connected to the selected nodes
			for (const nodeId of selectedNodeIds) {
				const connections = store().connectionLookup.get(nodeId);

				if (!connections) continue;

				for (const { edgeId } of connections.values()) {
					const edge = store().edgeLookup.get(edgeId);

					if (edge && (edge.selectable ?? edgesSelectable)) {
						selectedEdgeIds.add(edgeId);
					}
				}
			}

			// this prevents unnecessary updates while updating the selection rectangle
			if (!isSetEqual(prevSelectedNodeIds, selectedNodeIds)) {
				store(store().nodes = store().nodes.map(toggleSelected(selectedNodeIds)), true);
			}

			if (!isSetEqual(prevSelectedEdgeIds, selectedEdgeIds)) {
				store(store().edges = store().edges.map(toggleSelected(selectedEdgeIds)), true);
			}

			store(store().selectionRectMode = 'user', true);
			store(store().selectionRect = nextUserSelectRect, true);
		}

		function onPointerUp(event) {
			if (event.button !== 0) {
				return;
			}

			event.target?.releasePointerCapture?.(event.pointerId);

			// We only want to trigger click functions when in selection mode if
			// the user did not move the mouse.
			if (!selectionInProgress && event.target === container) {
				onClick?.(event);
			}

			store(store().selectionRect = null, true);

			if (selectionInProgress) {
				store(store().selectionRectMode = selectedNodeIds.size > 0 ? 'nodes' : null, true);
			}

			if (selectionInProgress) {
				$$props.onselectionend?.(event);
			}
		}

		const onContextMenu = (event) => {
			if (Array.isArray(get$2(panOnDragActive)) && get$2(panOnDragActive).includes(2)) {
				event.preventDefault();

				return;
			}

			$$props.onpanecontextmenu?.({ event });
		};

		const onClickCapture = (event) => {
			if (selectionInProgress) {
				event.stopPropagation();
				selectionInProgress = false;
			}
		};

		function onClick(event) {
			// We prevent click events when the user let go of the selectionKey during a selection
			// We also prevent click events when a connection is in progress
			if (selectionInProgress || store().connection.inProgress) {
				selectionInProgress = false;

				return;
			}

			$$props.onpaneclick?.({ event });
			store().unselectNodesAndEdges();
			store(store().selectionRectMode = null, true);
			store(store().selectionRect = null, true);
		}

		var div = root$8();
		let classes;
		var event_handler = user_derived(() => get$2(isSelectionEnabled) ? undefined : wrapHandler(onClick, container));

		div.__click = function (...$$args) {
			get$2(event_handler)?.apply(this, $$args);
		};

		div.__pointermove = function (...$$args) {
			(get$2(isSelectionEnabled) ? onPointerMove : undefined)?.apply(this, $$args);
		};

		div.__pointerup = function (...$$args) {
			(get$2(isSelectionEnabled) ? onPointerUp : undefined)?.apply(this, $$args);
		};

		var event_handler_1 = user_derived(() => wrapHandler(onContextMenu, container));

		div.__contextmenu = function (...$$args) {
			get$2(event_handler_1)?.apply(this, $$args);
		};

		var node = child(div);

		snippet(node, () => $$props.children);
		bind_this(div, ($$value) => container = $$value, () => container);

		template_effect(($0) => classes = set_class(div, 1, 'svelte-flow__pane svelte-flow__container', null, classes, $0), [
			() => ({
				draggable: panOnDrag() === true || Array.isArray(panOnDrag()) && panOnDrag().includes(0),
				dragging: store().dragging,
				selection: get$2(isSelecting)
			})
		]);

		event(
			'pointerdown',
			div,
			function (...$$args) {
				(get$2(isSelectionEnabled) ? onPointerDownCapture : undefined)?.apply(this, $$args);
			},
			true
		);

		event(
			'click',
			div,
			function (...$$args) {
				(get$2(isSelectionEnabled) ? onClickCapture : undefined)?.apply(this, $$args);
			},
			true
		);

		append($$anchor, div);
		pop();
	}

	delegate(['click', 'pointermove', 'pointerup', 'contextmenu']);

	var root$7 = from_html(`<div class="svelte-flow__viewport xyflow__viewport svelte-flow__container"><!></div>`);

	function Viewport($$anchor, $$props) {
		push($$props, true);

		var div = root$7();
		let styles;
		var node = child(div);

		snippet(node, () => $$props.children);

		template_effect(() => styles = set_style(div, '', styles, {
			transform: `translate(${$$props.store.viewport.x ?? ''}px, ${$$props.store.viewport.y ?? ''}px) scale(${$$props.store.viewport.zoom ?? ''})`
		}));

		append($$anchor, div);
		pop();
	}

	function drag(domNode, params) {
	    const { store, onDrag, onDragStart, onDragStop, onNodeMouseDown } = params;
	    const dragInstance = XYDrag({
	        onDrag,
	        onDragStart,
	        onDragStop,
	        onNodeMouseDown,
	        getStoreItems: () => {
	            const { snapGrid, viewport } = store;
	            return {
	                nodes: store.nodes,
	                nodeLookup: store.nodeLookup,
	                edges: store.edges,
	                nodeExtent: store.nodeExtent,
	                snapGrid: snapGrid ? snapGrid : [0, 0],
	                snapToGrid: !!snapGrid,
	                nodeOrigin: store.nodeOrigin,
	                multiSelectionActive: store.multiselectionKeyPressed,
	                domNode: store.domNode,
	                transform: [viewport.x, viewport.y, viewport.zoom],
	                autoPanOnNodeDrag: store.autoPanOnNodeDrag,
	                nodesDraggable: store.nodesDraggable,
	                selectNodesOnDrag: store.selectNodesOnDrag,
	                nodeDragThreshold: store.nodeDragThreshold,
	                unselectNodesAndEdges: store.unselectNodesAndEdges,
	                updateNodePositions: store.updateNodePositions,
	                onSelectionDrag: store.onselectiondrag,
	                onSelectionDragStart: store.onselectiondragstart,
	                onSelectionDragStop: store.onselectiondragstop,
	                panBy: store.panBy
	            };
	        }
	    });
	    function updateDrag(domNode, params) {
	        if (params.disabled) {
	            dragInstance.destroy();
	            return;
	        }
	        dragInstance.update({
	            domNode,
	            noDragClassName: params.noDragClass,
	            handleSelector: params.handleSelector,
	            nodeId: params.nodeId,
	            isSelectable: params.isSelectable,
	            nodeClickDistance: params.nodeClickDistance
	        });
	    }
	    updateDrag(domNode, params);
	    return {
	        update(params) {
	            updateDrag(domNode, params);
	        },
	        destroy() {
	            dragInstance.destroy();
	        }
	    };
	}

	var root_1$7 = from_html(`<div aria-live="assertive" aria-atomic="true" class="a11y-live-msg svelte-13pq11u"> </div>`);
	var root$6 = from_html(`<div class="a11y-hidden svelte-13pq11u"> </div> <div class="a11y-hidden svelte-13pq11u"> </div> <!>`, 1);

	function A11yDescriptions($$anchor, $$props) {
		push($$props, true);

		var fragment = root$6();
		var div = first_child(fragment);
		var text = child(div);

		var div_1 = sibling(div, 2);
		var text_1 = child(div_1);

		var node = sibling(div_1, 2);

		{
			var consequent = ($$anchor) => {
				var div_2 = root_1$7();
				var text_2 = child(div_2);

				template_effect(() => {
					set_attribute(div_2, 'id', `${ARIA_LIVE_MESSAGE}-${$$props.store.flowId}`);
					set_text(text_2, $$props.store.ariaLiveMessage);
				});

				append($$anchor, div_2);
			};

			if_block(node, ($$render) => {
				if (!$$props.store.disableKeyboardA11y) $$render(consequent);
			});
		}

		template_effect(() => {
			set_attribute(div, 'id', `${ARIA_NODE_DESC_KEY}-${$$props.store.flowId}`);

			set_text(text, $$props.store.disableKeyboardA11y
				? $$props.store.ariaLabelConfig['node.a11yDescription.default']
				: $$props.store.ariaLabelConfig['node.a11yDescription.keyboardDisabled']);

			set_attribute(div_1, 'id', `${ARIA_EDGE_DESC_KEY}-${$$props.store.flowId}`);
			set_text(text_1, $$props.store.ariaLabelConfig['edge.a11yDescription.default']);
		});

		append($$anchor, fragment);
		pop();
	}

	const ARIA_NODE_DESC_KEY = 'svelte-flow__node-desc';
	const ARIA_EDGE_DESC_KEY = 'svelte-flow__edge-desc';
	const ARIA_LIVE_MESSAGE = 'svelte-flow__aria-live';

	var root_1$6 = from_html(`<div><!></div>`);

	function NodeWrapper($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15);

		let data = user_derived(() => fallback($$props.node.data, () => ({}), true)),
			selected = user_derived(() => fallback($$props.node.selected, false)),
			_draggable = user_derived(() => $$props.node.draggable),
			_selectable = user_derived(() => $$props.node.selectable),
			deletable = user_derived(() => fallback($$props.node.deletable, true)),
			_connectable = user_derived(() => $$props.node.connectable),
			_focusable = user_derived(() => $$props.node.focusable),
			hidden = user_derived(() => fallback($$props.node.hidden, false)),
			dragging = user_derived(() => fallback($$props.node.dragging, false)),
			style = user_derived(() => fallback($$props.node.style, '')),
			className = user_derived(() => $$props.node.class),
			type = user_derived(() => fallback($$props.node.type, 'default')),
			parentId = user_derived(() => $$props.node.parentId),
			sourcePosition = user_derived(() => $$props.node.sourcePosition),
			targetPosition = user_derived(() => $$props.node.targetPosition),
			measuredWidth = user_derived(() => fallback($$props.node.measured, () => ({ width: 0, height: 0 }), true).width),
			measuredHeight = user_derived(() => fallback($$props.node.measured, () => ({ width: 0, height: 0 }), true).height),
			initialWidth = user_derived(() => $$props.node.initialWidth),
			initialHeight = user_derived(() => $$props.node.initialHeight),
			width = user_derived(() => $$props.node.width),
			height = user_derived(() => $$props.node.height),
			dragHandle = user_derived(() => $$props.node.dragHandle),
			zIndex = user_derived(() => fallback($$props.node.internals.z, 0)),
			positionX = user_derived(() => $$props.node.internals.positionAbsolute.x),
			positionY = user_derived(() => $$props.node.internals.positionAbsolute.y),
			userNode = user_derived(() => $$props.node.internals.userNode);

		let { id } = $$props.node;
		let draggable = user_derived(() => get$2(_draggable) ?? store().nodesDraggable);
		let selectable = user_derived(() => get$2(_selectable) ?? store().elementsSelectable);
		let connectable = user_derived(() => get$2(_connectable) ?? store().nodesConnectable);
		let hasDimensions = user_derived(() => nodeHasDimensions($$props.node));
		let hasHandleBounds = user_derived(() => !!$$props.node.internals.handleBounds);
		let isInitialized = user_derived(() => get$2(hasDimensions) && get$2(hasHandleBounds));
		let focusable = user_derived(() => get$2(_focusable) ?? store().nodesFocusable);

		function isInParentLookup(id) {
			return store().parentLookup.has(id);
		}

		let isParent = user_derived(() => isInParentLookup(id));
		let nodeRef = state(null);
		let prevNodeRef = null;

		// svelte-ignore state_referenced_locally
		let prevType = get$2(type);

		// svelte-ignore state_referenced_locally
		let prevSourcePosition = get$2(sourcePosition);

		// svelte-ignore state_referenced_locally
		let prevTargetPosition = get$2(targetPosition);

		let NodeComponent = user_derived(() => store().nodeTypes[get$2(type)] ?? DefaultNode);
		let ariaLabelConfig = user_derived(() => store().ariaLabelConfig);

		let connectableContext = {
			get value() {
				return get$2(connectable);
			}
		};

		setNodeIdContext(id);
		setNodeConnectableContext(connectableContext);

		if (process.env.NODE_ENV === 'development') {
			user_effect(() => {
				const valid = !!store().nodeTypes[get$2(type)];

				if (!valid) {
					console.warn('003', errorMessages['error003'](get$2(type)));
				}
			});
		}

		let nodeStyle = user_derived(() => {
			const w = get$2(measuredWidth) === undefined ? get$2(width) ?? get$2(initialWidth) : get$2(width);
			const h = get$2(measuredHeight) === undefined ? get$2(height) ?? get$2(initialHeight) : get$2(height);

			if (w === undefined && h === undefined && get$2(style) === undefined) {
				return undefined;
			}

			return `${get$2(style)};${w ? `width:${toPxString(w)};` : ''}${h ? `height:${toPxString(h)};` : ''}`;
		});

		user_effect(() => {
			// if type, sourcePosition or targetPosition changes,
			// we need to re-calculate the handle positions
			const doUpdate = get$2(type) !== prevType || get$2(sourcePosition) !== prevSourcePosition || get$2(targetPosition) !== prevTargetPosition;

			if (doUpdate && get$2(nodeRef) !== null) {
				requestAnimationFrame(() => {
					if (get$2(nodeRef) !== null) {
						store().updateNodeInternals(new Map([[id, { id, nodeElement: get$2(nodeRef), force: true }]]));
					}
				});
			}

			prevType = get$2(type);
			prevSourcePosition = get$2(sourcePosition);
			prevTargetPosition = get$2(targetPosition);
		});

		user_effect(() => {
			/* eslint-disable @typescript-eslint/no-unused-expressions */
			if ($$props.resizeObserver && (!get$2(isInitialized) || get$2(nodeRef) !== prevNodeRef)) {
				prevNodeRef && $$props.resizeObserver.unobserve(prevNodeRef);
				get$2(nodeRef) && $$props.resizeObserver.observe(get$2(nodeRef));
				prevNodeRef = get$2(nodeRef);
			}

			/* eslint-enable @typescript-eslint/no-unused-expressions */
		});

		onDestroy(() => {
			if (prevNodeRef) {
				$$props.resizeObserver?.unobserve(prevNodeRef);
			}
		});

		function onSelectNodeHandler(event) {
			if (get$2(selectable) && (!store().selectNodesOnDrag || !get$2(draggable) || store().nodeDragThreshold > 0)) {
				// this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
				// here we only need to call it when selectNodesOnDrag=false
				store().handleNodeSelection(id);
			}

			$$props.onnodeclick?.({ node: get$2(userNode), event });
		}

		function onKeyDown(event) {
			if (isInputDOMNode(event) || store().disableKeyboardA11y) {
				return;
			}

			if (elementSelectionKeys.includes(event.key) && get$2(selectable)) {
				const unselect = event.key === 'Escape';

				store().handleNodeSelection(id, unselect, get$2(nodeRef));
			} else if (get$2(draggable) && $$props.node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
				// prevent default scrolling behavior on arrow key press when node is moved
				event.preventDefault();

				store(
					store().ariaLiveMessage = get$2(ariaLabelConfig)['node.a11yDescription.ariaLiveMessage']({
						direction: event.key.replace('Arrow', '').toLowerCase(),
						x: ~~$$props.node.internals.positionAbsolute.x,
						y: ~~$$props.node.internals.positionAbsolute.y
					}),
					true
				);

				store().moveSelectedNodes(arrowKeyDiffs[event.key], event.shiftKey ? 4 : 1);
			}
		}

		const onFocus = () => {
			if (store().disableKeyboardA11y || !store().autoPanOnNodeFocus || !get$2(nodeRef)?.matches(':focus-visible')) {
				return;
			}

			const { width, height, viewport } = store();
			const withinViewport = getNodesInside(new Map([[id, $$props.node]]), { x: 0, y: 0, width, height }, [viewport.x, viewport.y, viewport.zoom], true).length > 0;

			if (!withinViewport) {
				store().setCenter($$props.node.position.x + ($$props.node.measured.width ?? 0) / 2, $$props.node.position.y + ($$props.node.measured.height ?? 0) / 2, { zoom: viewport.zoom });
			}
		};

		var fragment = comment();
		var node_1 = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var div = root_1$6();

				attribute_effect(div, () => ({
					'data-id': id,
					class: [
						'svelte-flow__node',
						`svelte-flow__node-${get$2(type)}`,
						get$2(className)
					],
					style: get$2(nodeStyle),
					onclick: onSelectNodeHandler,
					onpointerenter: $$props.onnodepointerenter
						? (event) => $$props.onnodepointerenter({ node: get$2(userNode), event })
						: undefined,

					onpointerleave: $$props.onnodepointerleave
						? (event) => $$props.onnodepointerleave({ node: get$2(userNode), event })
						: undefined,

					onpointermove: $$props.onnodepointermove
						? (event) => $$props.onnodepointermove({ node: get$2(userNode), event })
						: undefined,

					oncontextmenu: $$props.onnodecontextmenu
						? (event) => $$props.onnodecontextmenu({ node: get$2(userNode), event })
						: undefined,
					onkeydown: get$2(focusable) ? onKeyDown : undefined,
					onfocus: get$2(focusable) ? onFocus : undefined,
					tabIndex: get$2(focusable) ? 0 : undefined,
					role: $$props.node.ariaRole ?? (get$2(focusable) ? 'group' : undefined),
					'aria-roledescription': 'node',
					'aria-describedby': store().disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${store().flowId}`,
					...$$props.node.domAttributes,
					[CLASS]: {
						dragging: get$2(dragging),
						selected: get$2(selected),
						draggable: get$2(draggable),
						connectable: get$2(connectable),
						selectable: get$2(selectable),
						nopan: get$2(draggable),
						parent: get$2(isParent)
					},
					[STYLE]: {
						'z-index': get$2(zIndex),
						transform: `translate(${get$2(positionX) ?? ''}px, ${get$2(positionY) ?? ''}px)`,
						visibility: get$2(hasDimensions) ? 'visible' : 'hidden'
					}
				}));

				var node_2 = child(div);

				component(node_2, () => get$2(NodeComponent), ($$anchor, NodeComponent_1) => {
					NodeComponent_1($$anchor, {
						get data() {
							return get$2(data);
						},

						get id() {
							return id;
						},

						get selected() {
							return get$2(selected);
						},

						get selectable() {
							return get$2(selectable);
						},

						get deletable() {
							return get$2(deletable);
						},

						get sourcePosition() {
							return get$2(sourcePosition);
						},

						get targetPosition() {
							return get$2(targetPosition);
						},

						get zIndex() {
							return get$2(zIndex);
						},

						get dragging() {
							return get$2(dragging);
						},

						get draggable() {
							return get$2(draggable);
						},

						get dragHandle() {
							return get$2(dragHandle);
						},

						get parentId() {
							return get$2(parentId);
						},

						get type() {
							return get$2(type);
						},

						get isConnectable() {
							return get$2(connectable);
						},

						get positionAbsoluteX() {
							return get$2(positionX);
						},

						get positionAbsoluteY() {
							return get$2(positionY);
						},

						get width() {
							return get$2(width);
						},

						get height() {
							return get$2(height);
						}
					});
				});

				action(div, ($$node, $$action_arg) => drag?.($$node, $$action_arg), () => ({
					nodeId: id,
					isSelectable: get$2(selectable),
					disabled: !get$2(draggable),
					handleSelector: get$2(dragHandle),
					noDragClass: store().noDragClass,
					nodeClickDistance: $$props.nodeClickDistance,
					onNodeMouseDown: store().handleNodeSelection,
					onDrag: (event, _, targetNode, nodes) => {
						$$props.onnodedrag?.({ event, targetNode, nodes });
					},

					onDragStart: (event, _, targetNode, nodes) => {
						$$props.onnodedragstart?.({ event, targetNode, nodes });
					},

					onDragStop: (event, _, targetNode, nodes) => {
						$$props.onnodedragstop?.({ event, targetNode, nodes });
					},
					store: store()
				}));

				bind_this(div, ($$value) => set$2(nodeRef, $$value), () => get$2(nodeRef));
				append($$anchor, div);
			};

			if_block(node_1, ($$render) => {
				if (!get$2(hidden)) $$render(consequent);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	var root$5 = from_html(`<div class="svelte-flow__nodes"></div>`);

	function NodeRenderer($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15);

		const resizeObserver = typeof ResizeObserver === 'undefined'
			? null
			: new ResizeObserver((entries) => {
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				const updates = new Map();

				entries.forEach((entry) => {
					const id = entry.target.getAttribute('data-id');

					updates.set(id, { id, nodeElement: entry.target, force: true });
				});

				store().updateNodeInternals(updates);
			});

		onDestroy(() => {
			resizeObserver?.disconnect();
		});

		var div = root$5();

		each(div, 21, () => store().visible.nodes.values(), (node) => node.id, ($$anchor, node) => {
			NodeWrapper($$anchor, {
				get node() {
					return get$2(node);
				},

				get resizeObserver() {
					return resizeObserver;
				},

				get nodeClickDistance() {
					return $$props.nodeClickDistance;
				},

				get onnodeclick() {
					return $$props.onnodeclick;
				},

				get onnodepointerenter() {
					return $$props.onnodepointerenter;
				},

				get onnodepointermove() {
					return $$props.onnodepointermove;
				},

				get onnodepointerleave() {
					return $$props.onnodepointerleave;
				},

				get onnodedrag() {
					return $$props.onnodedrag;
				},

				get onnodedragstart() {
					return $$props.onnodedragstart;
				},

				get onnodedragstop() {
					return $$props.onnodedragstop;
				},

				get onnodecontextmenu() {
					return $$props.onnodecontextmenu;
				},

				get store() {
					return store();
				},

				set store($$value) {
					store($$value);
				}
			});
		});
		append($$anchor, div);
		pop();
	}

	var root_1$5 = from_svg(`<svg class="svelte-flow__edge-wrapper"><g><!></g></svg>`);

	function EdgeWrapper($$anchor, $$props) {
		push($$props, true);

		let id = user_derived(() => $$props.edge.id),
			source = user_derived(() => $$props.edge.source),
			target = user_derived(() => $$props.edge.target),
			sourceX = user_derived(() => $$props.edge.sourceX),
			sourceY = user_derived(() => $$props.edge.sourceY),
			targetX = user_derived(() => $$props.edge.targetX),
			targetY = user_derived(() => $$props.edge.targetY),
			sourcePosition = user_derived(() => $$props.edge.sourcePosition),
			targetPosition = user_derived(() => $$props.edge.targetPosition),
			animated = user_derived(() => fallback($$props.edge.animated, false)),
			selected = user_derived(() => fallback($$props.edge.selected, false)),
			label = user_derived(() => $$props.edge.label),
			labelStyle = user_derived(() => $$props.edge.labelStyle),
			data = user_derived(() => fallback($$props.edge.data, () => ({}), true)),
			style = user_derived(() => $$props.edge.style),
			interactionWidth = user_derived(() => $$props.edge.interactionWidth),
			type = user_derived(() => fallback($$props.edge.type, 'default')),
			sourceHandle = user_derived(() => $$props.edge.sourceHandle),
			targetHandle = user_derived(() => $$props.edge.targetHandle),
			markerStart = user_derived(() => $$props.edge.markerStart),
			markerEnd = user_derived(() => $$props.edge.markerEnd),
			_selectable = user_derived(() => $$props.edge.selectable),
			_focusable = user_derived(() => $$props.edge.focusable),
			deletable = user_derived(() => fallback($$props.edge.deletable, true)),
			hidden = user_derived(() => $$props.edge.hidden),
			zIndex = user_derived(() => $$props.edge.zIndex),
			className = user_derived(() => $$props.edge.class),
			ariaLabel = user_derived(() => $$props.edge.ariaLabel);

		// svelte-ignore state_referenced_locally
		setEdgeIdContext(get$2(id));

		// svelte-ignore non_reactive_update
		let edgeRef = null;

		let selectable = user_derived(() => get$2(_selectable) ?? $$props.store.elementsSelectable);
		let focusable = user_derived(() => get$2(_focusable) ?? $$props.store.edgesFocusable);
		let EdgeComponent = user_derived(() => $$props.store.edgeTypes[get$2(type)] ?? BezierEdge);

		let markerStartUrl = user_derived(() => get$2(markerStart)
			? `url('#${getMarkerId(get$2(markerStart), $$props.store.flowId)}')`
			: undefined);

		let markerEndUrl = user_derived(() => get$2(markerEnd)
			? `url('#${getMarkerId(get$2(markerEnd), $$props.store.flowId)}')`
			: undefined);

		function onclick(event) {
			const edge = $$props.store.edgeLookup.get(get$2(id));

			if (edge) {
				if (get$2(selectable)) $$props.store.handleEdgeSelection(get$2(id));

				$$props.onedgeclick?.({ event, edge });
			}
		}

		function onmouseevent(event, callback) {
			const edge = $$props.store.edgeLookup.get(get$2(id));

			if (edge) {
				callback({ event, edge });
			}
		}

		function onkeydown(event) {
			if (!$$props.store.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && get$2(selectable)) {
				const { unselectNodesAndEdges, addSelectedEdges } = $$props.store;
				const unselect = event.key === 'Escape';

				if (unselect) {
					edgeRef?.blur();
					unselectNodesAndEdges({ edges: [$$props.edge] });
				} else {
					addSelectedEdges([get$2(id)]);
				}
			}
		}

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var svg = root_1$5();
				let styles;
				var g = child(svg);

				attribute_effect(g, () => ({
					class: ['svelte-flow__edge', get$2(className)],
					'data-id': get$2(id),
					onclick,
					oncontextmenu: $$props.onedgecontextmenu
						? (e) => {
							onmouseevent(e, $$props.onedgecontextmenu);
						}
						: undefined,

					onpointerenter: $$props.onedgepointerenter
						? (e) => {
							onmouseevent(e, $$props.onedgepointerenter);
						}
						: undefined,

					onpointerleave: $$props.onedgepointerleave
						? (e) => {
							onmouseevent(e, $$props.onedgepointerleave);
						}
						: undefined,

					'aria-label': get$2(ariaLabel) === null
						? undefined
						: get$2(ariaLabel)
							? get$2(ariaLabel)
							: `Edge from ${get$2(source)} to ${get$2(target)}`,

					'aria-describedby': get$2(focusable)
						? `${ARIA_EDGE_DESC_KEY}-${$$props.store.flowId}`
						: undefined,
					role: $$props.edge.ariaRole ?? (get$2(focusable) ? 'group' : 'img'),
					'aria-roledescription': 'edge',
					onkeydown: get$2(focusable) ? onkeydown : undefined,
					tabindex: get$2(focusable) ? 0 : undefined,
					...$$props.edge.domAttributes,
					[CLASS]: {
						animated: get$2(animated),
						selected: get$2(selected),
						selectable: get$2(selectable)
					}
				}));

				var node_1 = child(g);

				component(node_1, () => get$2(EdgeComponent), ($$anchor, EdgeComponent_1) => {
					EdgeComponent_1($$anchor, {
						get id() {
							return get$2(id);
						},

						get source() {
							return get$2(source);
						},

						get target() {
							return get$2(target);
						},

						get sourceX() {
							return get$2(sourceX);
						},

						get sourceY() {
							return get$2(sourceY);
						},

						get targetX() {
							return get$2(targetX);
						},

						get targetY() {
							return get$2(targetY);
						},

						get sourcePosition() {
							return get$2(sourcePosition);
						},

						get targetPosition() {
							return get$2(targetPosition);
						},

						get animated() {
							return get$2(animated);
						},

						get selected() {
							return get$2(selected);
						},

						get label() {
							return get$2(label);
						},

						get labelStyle() {
							return get$2(labelStyle);
						},

						get data() {
							return get$2(data);
						},

						get style() {
							return get$2(style);
						},

						get interactionWidth() {
							return get$2(interactionWidth);
						},

						get selectable() {
							return get$2(selectable);
						},

						get deletable() {
							return get$2(deletable);
						},

						get type() {
							return get$2(type);
						},

						get sourceHandleId() {
							return get$2(sourceHandle);
						},

						get targetHandleId() {
							return get$2(targetHandle);
						},

						get markerStart() {
							return get$2(markerStartUrl);
						},

						get markerEnd() {
							return get$2(markerEndUrl);
						}
					});
				});
				bind_this(g, ($$value) => edgeRef = $$value, () => edgeRef);
				template_effect(() => styles = set_style(svg, '', styles, { 'z-index': get$2(zIndex) }));
				append($$anchor, svg);
			};

			if_block(node, ($$render) => {
				if (!get$2(hidden)) $$render(consequent);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	enable_legacy_mode_flag();

	var root$4 = from_svg(`<defs></defs>`);

	function MarkerDefinition($$anchor, $$props) {
		push($$props, false);

		const store = useStore();

		init$1();

		var defs = root$4();

		each(defs, 5, () => store.markers, (marker) => marker.id, ($$anchor, marker) => {
			Marker($$anchor, spread_props(() => get$2(marker)));
		});
		append($$anchor, defs);
		pop();
	}

	var root_1$4 = from_svg(`<polyline class="arrow" fill="none" stroke-linecap="round" stroke-linejoin="round" points="-5,-4 0,0 -5,4"></polyline>`);
	var root_2$1 = from_svg(`<polyline class="arrowclosed" stroke-linecap="round" stroke-linejoin="round" points="-5,-4 0,0 -5,4 -5,-4"></polyline>`);
	var root$3 = from_svg(`<marker class="svelte-flow__arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0"><!></marker>`);

	function Marker($$anchor, $$props) {
		push($$props, true);

		let width = prop($$props, 'width', 3, 12.5),
			height = prop($$props, 'height', 3, 12.5),
			markerUnits = prop($$props, 'markerUnits', 3, 'strokeWidth'),
			orient = prop($$props, 'orient', 3, 'auto-start-reverse'),
			color = prop($$props, 'color', 3, 'none');

		var marker = root$3();
		var node = child(marker);

		{
			var consequent = ($$anchor) => {
				var polyline = root_1$4();
				let styles;

				template_effect(() => {
					set_attribute(polyline, 'stroke-width', $$props.strokeWidth);
					styles = set_style(polyline, '', styles, { stroke: color() });
				});

				append($$anchor, polyline);
			};

			var consequent_1 = ($$anchor) => {
				var polyline_1 = root_2$1();
				let styles_1;

				template_effect(() => {
					set_attribute(polyline_1, 'stroke-width', $$props.strokeWidth);
					styles_1 = set_style(polyline_1, '', styles_1, { stroke: color(), fill: color() });
				});

				append($$anchor, polyline_1);
			};

			if_block(node, ($$render) => {
				if ($$props.type === MarkerType.Arrow) $$render(consequent); else if ($$props.type === MarkerType.ArrowClosed) $$render(consequent_1, 1);
			});
		}

		template_effect(() => {
			set_attribute(marker, 'id', $$props.id);
			set_attribute(marker, 'markerWidth', `${width()}`);
			set_attribute(marker, 'markerHeight', `${height()}`);
			set_attribute(marker, 'markerUnits', markerUnits());
			set_attribute(marker, 'orient', orient());
		});

		append($$anchor, marker);
		pop();
	}

	var root$2 = from_html(`<div class="svelte-flow__edges"><svg class="svelte-flow__marker"><!></svg> <!></div>`);

	function EdgeRenderer($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15);
		var div = root$2();
		var svg = child(div);
		var node = child(svg);

		MarkerDefinition(node, {});

		var node_1 = sibling(svg, 2);

		each(node_1, 17, () => store().visible.edges.values(), (edge) => edge.id, ($$anchor, edge) => {
			EdgeWrapper($$anchor, {
				get edge() {
					return get$2(edge);
				},

				get onedgeclick() {
					return $$props.onedgeclick;
				},

				get onedgecontextmenu() {
					return $$props.onedgecontextmenu;
				},

				get onedgepointerenter() {
					return $$props.onedgepointerenter;
				},

				get onedgepointerleave() {
					return $$props.onedgepointerleave;
				},

				get store() {
					return store();
				},

				set store($$value) {
					store($$value);
				}
			});
		});
		append($$anchor, div);
		pop();
	}

	var root_1$3 = from_html(`<div class="svelte-flow__selection svelte-1vr3gfi"></div>`);

	function Selection($$anchor, $$props) {
		push($$props, true);

		let x = prop($$props, 'x', 3, 0),
			y = prop($$props, 'y', 3, 0),
			width = prop($$props, 'width', 3, 0),
			height = prop($$props, 'height', 3, 0),
			isVisible = prop($$props, 'isVisible', 3, true);

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var div = root_1$3();
				let styles;

				template_effect(($0) => styles = set_style(div, '', styles, $0), [
					() => ({
						width: typeof width() === 'string' ? width() : toPxString(width()),
						height: typeof height() === 'string' ? height() : toPxString(height()),
						transform: `translate(${x()}px, ${y()}px)`
					})
				]);

				append($$anchor, div);
			};

			if_block(node, ($$render) => {
				if (isVisible()) $$render(consequent);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	var root_1$2 = from_html(`<div><!></div>`);

	function NodeSelection($$anchor, $$props) {
		push($$props, true);

		let ref = state(void 0);

		user_effect(() => {
			if (!$$props.store.disableKeyboardA11y) {
				get$2(ref)?.focus({ preventScroll: true });
			}
		});

		let bounds = user_derived(() => {
			if ($$props.store.selectionRectMode === 'nodes') {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				$$props.store.nodes;

				const nodeBounds = getInternalNodesBounds($$props.store.nodeLookup, { filter: (node) => !!node.selected });

				if (nodeBounds.width > 0 && nodeBounds.height > 0) {
					return nodeBounds;
				}
			}

			return null;
		});

		function oncontextmenu(event) {
			const selectedNodes = $$props.store.nodes.filter((n) => n.selected);

			$$props.onselectioncontextmenu?.({ nodes: selectedNodes, event });
		}

		function onclick(event) {
			const selectedNodes = $$props.store.nodes.filter((n) => n.selected);

			$$props.onselectionclick?.({ nodes: selectedNodes, event });
		}

		function onkeydown(event) {
			if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
				event.preventDefault();
				$$props.store.moveSelectedNodes(arrowKeyDiffs[event.key], event.shiftKey ? 4 : 1);
			}
		}

		var fragment = comment();
		var node_1 = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var div = root_1$2();

				div.__contextmenu = oncontextmenu;
				div.__click = onclick;

				div.__keydown = function (...$$args) {
					($$props.store.disableKeyboardA11y ? undefined : onkeydown)?.apply(this, $$args);
				};

				let styles;
				var node_2 = child(div);

				Selection(node_2, { width: '100%', height: '100%', x: 0, y: 0 });

				action(div, ($$node, $$action_arg) => drag?.($$node, $$action_arg), () => ({
					disabled: false,
					store: $$props.store,
					onDrag: (event, _, __, nodes) => {
						$$props.onnodedrag?.({ event, targetNode: null, nodes });
					},

					onDragStart: (event, _, __, nodes) => {
						$$props.onnodedragstart?.({ event, targetNode: null, nodes });
					},

					onDragStop: (event, _, __, nodes) => {
						$$props.onnodedragstop?.({ event, targetNode: null, nodes });
					}
				}));

				bind_this(div, ($$value) => set$2(ref, $$value), () => get$2(ref));

				template_effect(
					($0) => {
						set_class(div, 1, clsx(['svelte-flow__selection-wrapper', $$props.store.noPanClass]), 'svelte-sf2y5e');
						set_attribute(div, 'role', $$props.store.disableKeyboardA11y ? undefined : 'button');
						set_attribute(div, 'tabindex', $$props.store.disableKeyboardA11y ? undefined : -1);
						styles = set_style(div, '', styles, $0);
					},
					[
						() => ({
							width: toPxString(get$2(bounds).width),
							height: toPxString(get$2(bounds).height),
							transform: `translate(${get$2(bounds).x ?? ''}px, ${get$2(bounds).y ?? ''}px)`
						})
					]
				);

				append($$anchor, div);
			};

			var d = user_derived(() => $$props.store.selectionRectMode === 'nodes' && get$2(bounds) && isNumeric(get$2(bounds).x) && isNumeric(get$2(bounds).y));

			if_block(node_1, ($$render) => {
				if (get$2(d)) $$render(consequent);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	delegate(['contextmenu', 'click', 'keydown']);

	/**
	 * @param {import('./types.public').ShortcutModifier} def
	 * @returns {number}
	 */
	function mapModifierToBitMask(def) {
		switch (def) {
			case 'ctrl':
				return 0b1000;
			case 'shift':
				return 0b0100;
			case 'alt':
				return 0b0010;
			case 'meta':
				return 0b0001;
		}
	}

	/**
	 * Listen for keyboard event and trigger `shortcut` {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent | CustomEvent }
	 * @example Typical usage
	 *
	 * ```svelte
	 * <script lang="ts">
	 *  import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
	 *
	 *  let commandPalette = false;
	 *
	 *  function onOpenCommandPalette() {
	 *    commandPalette = true;
	 *  }
	 *  function onCloseCommandPalette() {
	 *    commandPalette = false;
	 *  }
	 *
	 *  function doSomethingElse(details: ShortcutEventDetail) {
	 *    console.log('Action was placed on:', details.node);
	 *    console.log('Trigger:', details.trigger);
	 *  }
	 *
	 *  function onShortcut(event: CustomEvent<ShortcutEventDetail>) {
	 *    if (event.detail.trigger.id === 'do-something-else') {
	 *      console.log('Same as doSomethingElse()');
	 *      // be careful here doSomethingElse would have been called too
	 *   }
	 * }
	 * </script>
	 *
	 * <svelte:window
	 *   use:shortcut={{
	 *     trigger: [
	 *       {
	 *         key: 'k',
	 *
	 *         // trigger if either ctrl or meta is pressed
	 *         modifier: ['ctrl', 'meta'],
	 *
	 *         callback: onOpenCommandPalette,
	 *         preventDefault: true,
	 *       },
	 *       {
	 *         key: 'Escape',
	 *         modifier: false, // or any falsy value other than undefined to means 'expect no modifier'
	 *
	 *         // preferably avoid arrow functions here for better performance
	 *         // with arrow functions the action has to be updated more frequently
	 *         callback: onCloseCommandPalette,
	 *
	 *         enabled: commandPalette,
	 *         preventDefault: true,
	 *       },
	 *      {
	 *         key: 'k',
	 *
	 *         // trigger if both ctrl & shift are pressed
	 *         modifier: [['ctrl', 'shift']],
	 *         id: 'do-something-else',
	 *         callback: doSomethingElse,
	 *      },
	 *     ],
	 *   }}
	 *   onshortcut={onShortcut}
	 * />
	 * ```
	 * You can either:
	 *
	 * - pass multiple callbacks to their associated triggers, or
	 *
	 * - pass one single handler to the `onshortcut` event, in which case you should
	 * provide an ID to each trigger to be able to distinguish what trigger was activated
	 * in the event handler.
	 *
	 * Either way, only use `callback` or `onshortcut` and not both to
	 * avoid handler duplication.
	 * @param {HTMLElement} node - HTMLElement to add event listener to
	 * @param {import('./types.public').ShortcutParameter} param - svelte action parameters
	 * @returns {import('./types.public').ShortcutActionReturn}
	 */
	function shortcut(node, param) {
		let { enabled = true, trigger, type = 'keydown' } = param;

		/**
		 * @param {KeyboardEvent} event
		 */
		function handler(event) {
			const normalizedTriggers = Array.isArray(trigger) ? trigger : [trigger];
			const modifierMask = [event.metaKey, event.altKey, event.shiftKey, event.ctrlKey].reduce(
				(acc, value, index) => {
					if (value) {
						return acc | (1 << index);
					}
					return acc;
				},
				0b0000,
			);
			for (const trigger of normalizedTriggers) {
				const mergedTrigger = {
					preventDefault: false,
					enabled: true,
					...trigger,
				};
				const { modifier, key, callback, preventDefault, enabled: triggerEnabled } = mergedTrigger;
				if (triggerEnabled) {
					if (event.key !== key) continue;

					if (modifier === null || modifier === false) {
						if (modifierMask !== 0b0000) continue;
					} else if (
						modifier !== undefined &&
						modifier?.[0]?.length > 0
					) {
						const orDefs = Array.isArray(modifier) ? modifier : [modifier];
						let modified = false;
						for (const orDef of orDefs) {
							const mask = (Array.isArray(orDef) ? orDef : [orDef]).reduce(
								(acc, def) => acc | mapModifierToBitMask(def),
								0b0000,
							);
							if (mask === modifierMask) {
								modified = true;
								break;
							}
						}
						if (!modified) continue;
					}

					if (preventDefault) event.preventDefault();
					/** @type {import('./types.public').ShortcutEventDetail} */
					const detail = {
						node,
						trigger: mergedTrigger,
						originalEvent: event,
					};
					node.dispatchEvent(new CustomEvent('shortcut', { detail }));
					callback?.(detail);
				}
			}
		}

		/** @type {undefined | (() => void)} */
		let off;
		if (enabled) {
			off = on(node, type, handler);
		}

		return {
			update: (update) => {
				const { enabled: newEnabled = true, type: newType = 'keydown' } = update;

				if (enabled && (!newEnabled || type !== newType)) {
					off?.();
				} else if (!enabled && newEnabled) {
					off = on(node, newType, handler);
				}

				enabled = newEnabled;
				type = newType;
				trigger = update.trigger;
			},
			destroy: () => {
				off?.();
			},
		};
	}

	/* useSvelteFlow.svelte.js generated by Svelte v5.50.3 */

	function useSvelteFlow() {
		const store = user_derived(useStore);

		const getNodeRect = (node) => {
			const nodeToUse = isNode(node) ? node : get$2(store).nodeLookup.get(node.id);

			const position = nodeToUse.parentId
				? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.measured, nodeToUse.parentId, get$2(store).nodeLookup, get$2(store).nodeOrigin)
				: nodeToUse.position;

			const nodeWithPosition = {
				...nodeToUse,
				position,
				width: nodeToUse.measured?.width ?? nodeToUse.width,
				height: nodeToUse.measured?.height ?? nodeToUse.height
			};

			return nodeToRect(nodeWithPosition);
		};

		function updateNode(id, nodeUpdate, options = { replace: false }) {
			get$2(store).nodes = untrack(() => get$2(store).nodes).map((node) => {
				if (node.id === id) {
					const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node) : nodeUpdate;

					return options?.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
				}

				return node;
			});
		}

		function updateEdge(id, edgeUpdate, options = { replace: false }) {
			get$2(store).edges = untrack(() => get$2(store).edges).map((edge) => {
				if (edge.id === id) {
					const nextEdge = typeof edgeUpdate === 'function' ? edgeUpdate(edge) : edgeUpdate;

					return options.replace && isEdge(nextEdge) ? nextEdge : { ...edge, ...nextEdge };
				}

				return edge;
			});
		}

		const getInternalNode = (id) => get$2(store).nodeLookup.get(id);

		return {
			zoomIn: get$2(store).zoomIn,
			zoomOut: get$2(store).zoomOut,
			getInternalNode,
			getNode: (id) => getInternalNode(id)?.internals.userNode,
			getNodes: (ids) => ids === undefined
				? get$2(store).nodes
				: getElements(get$2(store).nodeLookup, ids),
			getEdge: (id) => get$2(store).edgeLookup.get(id),
			getEdges: (ids) => ids === undefined
				? get$2(store).edges
				: getElements(get$2(store).edgeLookup, ids),

			setZoom: (zoomLevel, options) => {
				const panZoom = get$2(store).panZoom;

				return panZoom
					? panZoom.scaleTo(zoomLevel, { duration: options?.duration })
					: Promise.resolve(false);
			},
			getZoom: () => get$2(store).viewport.zoom,
			setViewport: async (nextViewport, options) => {
				const currentViewport = get$2(store).viewport;

				if (!get$2(store).panZoom) {
					return Promise.resolve(false);
				}

				await get$2(store).panZoom.setViewport(
					{
						x: nextViewport.x ?? currentViewport.x,
						y: nextViewport.y ?? currentViewport.y,
						zoom: nextViewport.zoom ?? currentViewport.zoom
					},
					options
				);

				return Promise.resolve(true);
			},
			getViewport: () => snapshot(get$2(store).viewport),
			setCenter: async (x, y, options) => get$2(store).setCenter(x, y, options),
			fitView: (options) => get$2(store).fitView(options),
			fitBounds: async (bounds, options) => {
				if (!get$2(store).panZoom) {
					return Promise.resolve(false);
				}

				const viewport = getViewportForBounds(bounds, get$2(store).width, get$2(store).height, get$2(store).minZoom, get$2(store).maxZoom, options?.padding ?? 0.1);

				await get$2(store).panZoom.setViewport(viewport, {
					duration: options?.duration,
					ease: options?.ease,
					interpolate: options?.interpolate
				});

				return Promise.resolve(true);
			},

			/**
			 * Partial is defined as "the 2 nodes/areas are intersecting partially".
			 * If a is contained in b or b is contained in a, they are both
			 * considered fully intersecting.
			 */
			getIntersectingNodes: (nodeOrRect, partially = true, nodesToIntersect) => {
				const isRect = isRectObject(nodeOrRect);
				const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

				if (!nodeRect) {
					return [];
				}

				return (nodesToIntersect || get$2(store).nodes).filter((n) => {
					const internalNode = get$2(store).nodeLookup.get(n.id);

					if (!internalNode || !isRect && n.id === nodeOrRect.id) {
						return false;
					}

					const currNodeRect = nodeToRect(internalNode);
					const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
					const partiallyVisible = partially && overlappingArea > 0;

					return partiallyVisible || overlappingArea >= currNodeRect.width * currNodeRect.height || overlappingArea >= nodeRect.width * nodeRect.height;
				});
			},

			isNodeIntersecting: (nodeOrRect, area, partially = true) => {
				const isRect = isRectObject(nodeOrRect);
				const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

				if (!nodeRect) {
					return false;
				}

				const overlappingArea = getOverlappingArea(nodeRect, area);
				const partiallyVisible = partially && overlappingArea > 0;

				return partiallyVisible || overlappingArea >= area.width * area.height || overlappingArea >= nodeRect.width * nodeRect.height;
			},

			deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
				const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
					nodesToRemove,
					edgesToRemove,
					nodes: get$2(store).nodes,
					edges: get$2(store).edges,
					onBeforeDelete: get$2(store).onbeforedelete
				});

				if (matchingNodes) {
					get$2(store).nodes = untrack(() => get$2(store).nodes).filter((node) => !matchingNodes.some(({ id }) => id === node.id));
				}

				if (matchingEdges) {
					get$2(store).edges = untrack(() => get$2(store).edges).filter((edge) => !matchingEdges.some(({ id }) => id === edge.id));
				}

				if (matchingNodes.length > 0 || matchingEdges.length > 0) {
					get$2(store).ondelete?.({ nodes: matchingNodes, edges: matchingEdges });
				}

				return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
			},

			screenToFlowPosition: (position, options = { snapToGrid: true }) => {
				if (!get$2(store).domNode) {
					return position;
				}

				const _snapGrid = options.snapToGrid ? get$2(store).snapGrid : false;
				const { x, y, zoom } = get$2(store).viewport;
				const { x: domX, y: domY } = get$2(store).domNode.getBoundingClientRect();
				const correctedPosition = { x: position.x - domX, y: position.y - domY };

				return pointToRendererPoint(correctedPosition, [x, y, zoom], _snapGrid !== null, _snapGrid || [1, 1]);
			},

			/**
			 *
			 * @param position
			 * @returns
			 */
			flowToScreenPosition: (position) => {
				if (!get$2(store).domNode) {
					return position;
				}

				const { x, y, zoom } = get$2(store).viewport;
				const { x: domX, y: domY } = get$2(store).domNode.getBoundingClientRect();
				const rendererPosition = rendererPointToPoint(position, [x, y, zoom]);

				return { x: rendererPosition.x + domX, y: rendererPosition.y + domY };
			},

			toObject: () => {
				return structuredClone({
					nodes: [...get$2(store).nodes],
					edges: [...get$2(store).edges],
					viewport: { ...get$2(store).viewport }
				});
			},
			updateNode,
			updateNodeData: (id, dataUpdate, options) => {
				const node = get$2(store).nodeLookup.get(id)?.internals.userNode;

				if (!node) {
					return;
				}

				const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;

				updateNode(id, (node) => ({
					...node,
					data: options?.replace ? nextData : { ...node.data, ...nextData }
				}));
			},
			updateEdge,
			getNodesBounds: (nodes) => {
				return getNodesBounds(nodes, {
					nodeLookup: get$2(store).nodeLookup,
					nodeOrigin: get$2(store).nodeOrigin
				});
			},
			getHandleConnections: ({ type, id, nodeId }) => Array.from(get$2(store).connectionLookup.get(`${nodeId}-${type}-${id ?? null}`)?.values() ?? [])
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getElements(lookup, ids) {
		const result = [];

		for (const id of ids) {
			const item = lookup.get(id);

			if (item) {
				const element = 'internals' in item ? item.internals?.userNode : item;

				result.push(element);
			}
		}

		return result;
	}

	function KeyHandler($$anchor, $$props) {
		push($$props, true);

		let store = prop($$props, 'store', 15),
			selectionKey = prop($$props, 'selectionKey', 3, 'Shift'),
			multiSelectionKey = prop($$props, 'multiSelectionKey', 19, () => isMacOs() ? 'Meta' : 'Control'),
			deleteKey = prop($$props, 'deleteKey', 3, 'Backspace'),
			panActivationKey = prop($$props, 'panActivationKey', 3, ' '),
			zoomActivationKey = prop($$props, 'zoomActivationKey', 19, () => isMacOs() ? 'Meta' : 'Control');

		let { deleteElements } = useSvelteFlow();

		function isKeyObject(key) {
			return key !== null && typeof key === 'object';
		}

		function getModifier(key) {
			return isKeyObject(key) ? key.modifier || [] : [];
		}

		function getKeyString(key) {
			if (key === null || key === undefined) {
				// this is a workaround to check if a key is set
				// if not we won't call the callback
				return '';
			}

			return isKeyObject(key) ? key.key : key;
		}

		function getShortcutTrigger(key, callback) {
			const keys = Array.isArray(key) ? key : [key];

			return keys.map((_key) => {
				const keyString = getKeyString(_key);

				return {
					key: keyString,
					modifier: getModifier(_key),
					enabled: keyString !== null,
					callback
				};
			});
		}

		function resetKeysAndSelection() {
			store(store().selectionRect = null, true);
			store(store().selectionKeyPressed = false, true);
			store(store().multiselectionKeyPressed = false, true);
			store(store().deleteKeyPressed = false, true);
			store(store().panActivationKeyPressed = false, true);
			store(store().zoomActivationKeyPressed = false, true);
		}

		function handleDelete() {
			const selectedNodes = store().nodes.filter((node) => node.selected);
			const selectedEdges = store().edges.filter((edge) => edge.selected);

			deleteElements({ nodes: selectedNodes, edges: selectedEdges });
		}

		event('blur', $window, resetKeysAndSelection);
		event('contextmenu', $window, resetKeysAndSelection);

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(selectionKey(), () => store(store().selectionKeyPressed = true, true)),
			type: 'keydown'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(selectionKey(), () => store(store().selectionKeyPressed = false, true)),
			type: 'keyup'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(multiSelectionKey(), () => {
				store(store().multiselectionKeyPressed = true, true);
			}),
			type: 'keydown'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(multiSelectionKey(), () => store(store().multiselectionKeyPressed = false, true)),
			type: 'keyup'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(deleteKey(), (detail) => {
				const isModifierKey = detail.originalEvent.ctrlKey || detail.originalEvent.metaKey || detail.originalEvent.shiftKey;

				if (!isModifierKey && !isInputDOMNode(detail.originalEvent)) {
					store(store().deleteKeyPressed = true, true);
					handleDelete();
				}
			}),
			type: 'keydown'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(deleteKey(), () => store(store().deleteKeyPressed = false, true)),
			type: 'keyup'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(panActivationKey(), () => store(store().panActivationKeyPressed = true, true)),
			type: 'keydown'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(panActivationKey(), () => store(store().panActivationKeyPressed = false, true)),
			type: 'keyup'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(zoomActivationKey(), () => store(store().zoomActivationKeyPressed = true, true)),
			type: 'keydown'
		}));

		action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
			trigger: getShortcutTrigger(zoomActivationKey(), () => store(store().zoomActivationKeyPressed = false, true)),
			type: 'keyup'
		}));

		pop();
	}

	var root_3$1 = from_svg(`<path fill="none" class="svelte-flow__connection-path"></path>`);
	var root_1$1 = from_svg(`<svg class="svelte-flow__connectionline"><g><!></g></svg>`);

	function ConnectionLine($$anchor, $$props) {
		push($$props, true);

		let path = user_derived(() => {
			if (!$$props.store.connection.inProgress) {
				return '';
			}

			const pathParams = {
				sourceX: $$props.store.connection.from.x,
				sourceY: $$props.store.connection.from.y,
				sourcePosition: $$props.store.connection.fromPosition,
				targetX: $$props.store.connection.to.x,
				targetY: $$props.store.connection.to.y,
				targetPosition: $$props.store.connection.toPosition
			};

			switch ($$props.type) {
				case ConnectionLineType.Bezier:
					{
						const [path] = getBezierPath(pathParams);

						return path;
					}

				case ConnectionLineType.Straight:
					{
						const [path] = getStraightPath(pathParams);

						return path;
					}

				case ConnectionLineType.Step:

				case ConnectionLineType.SmoothStep:
					{
						const [path] = getSmoothStepPath({
							...pathParams,
							borderRadius: $$props.type === ConnectionLineType.Step ? 0 : undefined
						});

						return path;
					}
			}
		});

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent_1 = ($$anchor) => {
				var svg = root_1$1();
				var g = child(svg);
				var node_1 = child(g);

				{
					var consequent = ($$anchor) => {
						var fragment_1 = comment();
						var node_2 = first_child(fragment_1);

						component(node_2, () => $$props.LineComponent, ($$anchor, LineComponent_1) => {
							LineComponent_1($$anchor, {});
						});

						append($$anchor, fragment_1);
					};

					var alternate = ($$anchor) => {
						var path_1 = root_3$1();

						template_effect(() => {
							set_attribute(path_1, 'd', get$2(path));
							set_style(path_1, $$props.style);
						});

						append($$anchor, path_1);
					};

					if_block(node_1, ($$render) => {
						if ($$props.LineComponent) $$render(consequent); else $$render(alternate, false);
					});
				}

				template_effect(
					($0) => {
						set_attribute(svg, 'width', $$props.store.width);
						set_attribute(svg, 'height', $$props.store.height);
						set_style(svg, $$props.containerStyle);
						set_class(g, 0, $0);
					},
					[
						() => clsx([
							'svelte-flow__connection',
							getConnectionStatus($$props.store.connection.isValid)
						])
					]
				);

				append($$anchor, svg);
			};

			if_block(node, ($$render) => {
				if ($$props.store.connection.inProgress) $$render(consequent_1);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	var root$1 = from_html(`<div><!></div>`);

	function Panel($$anchor, $$props) {
		push($$props, true);

		let position = prop($$props, 'position', 3, 'top-right'),
			rest = rest_props($$props, [
				'$$slots',
				'$$events',
				'$$legacy',
				'position',
				'style',
				'class',
				'children'
			]);

		let positionClasses = user_derived(() => `${position()}`.split('-'));
		var div = root$1();

		attribute_effect(div, ($0) => ({ class: $0, style: $$props.style, ...rest }), [
			() => [
				'svelte-flow__panel',
				$$props.class,
				...get$2(positionClasses)
			]
		]);

		var node = child(div);

		snippet(node, () => $$props.children ?? noop$1);
		append($$anchor, div);
		pop();
	}

	var root_2 = from_html(`<a href="https://svelteflow.dev" target="_blank" rel="noopener noreferrer" aria-label="Svelte Flow attribution">Svelte Flow</a>`);

	function Attribution($$anchor, $$props) {
		push($$props, true);

		let position = prop($$props, 'position', 3, 'bottom-right');
		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				Panel($$anchor, {
					get position() {
						return position();
					},
					class: 'svelte-flow__attribution',
					'data-message': 'Feel free to remove the attribution or check out how you could support us: https://svelteflow.dev/support-us',
					children: ($$anchor, $$slotProps) => {
						var a = root_2();

						append($$anchor, a);
					},
					$$slots: { default: true }
				});
			};

			if_block(node, ($$render) => {
				if (!$$props.proOptions?.hideAttribution) $$render(consequent);
			});
		}

		append($$anchor, fragment);
		pop();
	}

	var root = from_html(`<div><!></div>`);

	function Wrapper($$anchor, $$props) {
		push($$props, true);

		let domNode = prop($$props, 'domNode', 15),
			clientWidth = prop($$props, 'clientWidth', 15),
			clientHeight = prop($$props, 'clientHeight', 15);

		// Unfortunately we have to destructure the props here this way,
		// so we don't pass all the props as attributes to the div element
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let className = user_derived(() => $$props.rest.class),
			divAttributes = user_derived(() => exclude_from_object($$props.rest, [
				'id',
				'class',
				'nodeTypes',
				'edgeTypes',
				'colorMode',
				'isValidConnection',
				'onmove',
				'onmovestart',
				'onmoveend',
				'onflowerror',
				'ondelete',
				'onbeforedelete',
				'onbeforeconnect',
				'onconnect',
				'onconnectstart',
				'onconnectend',
				'onbeforereconnect',
				'onreconnect',
				'onreconnectstart',
				'onreconnectend',
				'onclickconnectstart',
				'onclickconnectend',
				'oninit',
				'onselectionchange',
				'onselectiondragstart',
				'onselectiondrag',
				'onselectiondragstop',
				'onselectionstart',
				'onselectionend',
				'clickConnect',
				'fitView',
				'fitViewOptions',
				'nodeOrigin',
				'nodeDragThreshold',
				'connectionDragThreshold',
				'minZoom',
				'maxZoom',
				'initialViewport',
				'connectionRadius',
				'connectionMode',
				'selectionMode',
				'selectNodesOnDrag',
				'snapGrid',
				'defaultMarkerColor',
				'translateExtent',
				'nodeExtent',
				'onlyRenderVisibleElements',
				'autoPanOnConnect',
				'autoPanOnNodeDrag',
				'colorModeSSR',
				'defaultEdgeOptions',
				'elevateNodesOnSelect',
				'elevateEdgesOnSelect',
				'nodesDraggable',
				'autoPanOnNodeFocus',
				'nodesConnectable',
				'elementsSelectable',
				'nodesFocusable',
				'edgesFocusable',
				'disableKeyboardA11y',
				'noDragClass',
				'noPanClass',
				'noWheelClass',
				'ariaLabelConfig',
				'autoPanSpeed',
				'panOnScrollSpeed',
				'zIndexMode'
			]));

		/* eslint-enable @typescript-eslint/no-unused-vars */
		// Undo scroll events, preventing viewport from shifting when nodes outside of it are focused
		function wrapperOnScroll(e) {
			e.currentTarget.scrollTo({ top: 0, left: 0, behavior: 'auto' });

			// Forward the event to any existing onscroll handler if needed
			if ($$props.rest.onscroll) {
				$$props.rest.onscroll(e);
			}
		}

		var div = root();

		attribute_effect(
			div,
			($0) => ({
				class: [
					'svelte-flow',
					'svelte-flow__container',
					get$2(className),
					$$props.colorMode
				],
				'data-testid': 'svelte-flow__wrapper',
				role: 'application',
				onscroll: wrapperOnScroll,
				...get$2(divAttributes),
				[STYLE]: $0
			}),
			[
				() => ({
					width: toPxString($$props.width),
					height: toPxString($$props.height)
				})
			],
			void 0,
			void 0,
			'svelte-mkap6j'
		);

		var node = child(div);

		snippet(node, () => $$props.children ?? noop$1);
		bind_this(div, ($$value) => domNode($$value), () => domNode());
		bind_element_size(div, 'clientHeight', clientHeight);
		bind_element_size(div, 'clientWidth', clientWidth);
		append($$anchor, div);
		pop();
	}

	var root_4 = from_html(`<div class="svelte-flow__viewport-back svelte-flow__container"></div> <!> <div class="svelte-flow__edge-labels svelte-flow__container"></div> <!> <!> <!> <div class="svelte-flow__viewport-front svelte-flow__container"></div>`, 1);
	var root_3 = from_html(`<!> <!>`, 1);
	var root_1 = from_html(`<!> <!> <!> <!> <!>`, 1);

	function SvelteFlow($$anchor, $$props) {
		push($$props, true);

		let paneClickDistance = prop($$props, 'paneClickDistance', 3, 1),
			nodeClickDistance = prop($$props, 'nodeClickDistance', 3, 1),
			panOnScrollMode = prop($$props, 'panOnScrollMode', 19, () => PanOnScrollMode.Free),
			preventScrolling = prop($$props, 'preventScrolling', 3, true),
			zoomOnScroll = prop($$props, 'zoomOnScroll', 3, true),
			zoomOnDoubleClick = prop($$props, 'zoomOnDoubleClick', 3, true),
			zoomOnPinch = prop($$props, 'zoomOnPinch', 3, true),
			panOnScroll = prop($$props, 'panOnScroll', 3, false),
			panOnScrollSpeed = prop($$props, 'panOnScrollSpeed', 3, 0.5),
			panOnDrag = prop($$props, 'panOnDrag', 3, true),
			selectionOnDrag = prop($$props, 'selectionOnDrag', 3, false),
			connectionLineType = prop($$props, 'connectionLineType', 19, () => ConnectionLineType.Bezier),
			nodes = prop($$props, 'nodes', 31, () => proxy([])),
			edges = prop($$props, 'edges', 31, () => proxy([])),
			viewport = prop($$props, 'viewport', 15, undefined),
			props = rest_props($$props, [
				'$$slots',
				'$$events',
				'$$legacy',
				'width',
				'height',
				'proOptions',
				'selectionKey',
				'deleteKey',
				'panActivationKey',
				'multiSelectionKey',
				'zoomActivationKey',
				'paneClickDistance',
				'nodeClickDistance',
				'onmovestart',
				'onmoveend',
				'onmove',
				'oninit',
				'onnodeclick',
				'onnodecontextmenu',
				'onnodedrag',
				'onnodedragstart',
				'onnodedragstop',
				'onnodepointerenter',
				'onnodepointermove',
				'onnodepointerleave',
				'onselectionclick',
				'onselectioncontextmenu',
				'onselectionstart',
				'onselectionend',
				'onedgeclick',
				'onedgecontextmenu',
				'onedgepointerenter',
				'onedgepointerleave',
				'onpaneclick',
				'onpanecontextmenu',
				'panOnScrollMode',
				'preventScrolling',
				'zoomOnScroll',
				'zoomOnDoubleClick',
				'zoomOnPinch',
				'panOnScroll',
				'panOnScrollSpeed',
				'panOnDrag',
				'selectionOnDrag',
				'connectionLineComponent',
				'connectionLineStyle',
				'connectionLineContainerStyle',
				'connectionLineType',
				'attributionPosition',
				'children',
				'nodes',
				'edges',
				'viewport'
			]);

		// svelte-ignore non_reactive_update, state_referenced_locally
		let store = createStore({
			props,
			width: $$props.width,
			height: $$props.height,
			get nodes() {
				return nodes();
			},

			set nodes(newNodes) {
				nodes(newNodes);
			},

			get edges() {
				return edges();
			},

			set edges(newEdges) {
				edges(newEdges);
			},

			get viewport() {
				return viewport();
			},

			set viewport(newViewport) {
				viewport(newViewport);
			}
		});

		// Set store for provider context
		const providerContext = getContext(key);

		if (providerContext && providerContext.setStore) {
			providerContext.setStore(store);
		}

		// Overwrite store context to give children direct access
		setContext(key, {
			provider: false,
			getStore() {
				return store;
			}
		});

		// handle selection change
		user_effect(() => {
			const params = { nodes: store.selectedNodes, edges: store.selectedEdges };

			untrack(() => $$props.onselectionchange)?.(params);

			for (const handler of store.selectionChangeHandlers.values()) {
				handler(params);
			}
		});

		onDestroy(() => {
			store.reset();
		});

		Wrapper($$anchor, {
			get colorMode() {
				return store.colorMode;
			},

			get width() {
				return $$props.width;
			},

			get height() {
				return $$props.height;
			},

			get rest() {
				return props;
			},

			get domNode() {
				return store.domNode;
			},

			set domNode($$value) {
				store.domNode = $$value;
			},

			get clientWidth() {
				return store.width;
			},

			set clientWidth($$value) {
				store.width = $$value;
			},

			get clientHeight() {
				return store.height;
			},

			set clientHeight($$value) {
				store.height = $$value;
			},

			children: ($$anchor, $$slotProps) => {
				var fragment_1 = root_1();
				var node = first_child(fragment_1);

				KeyHandler(node, {
					get selectionKey() {
						return $$props.selectionKey;
					},

					get deleteKey() {
						return $$props.deleteKey;
					},

					get panActivationKey() {
						return $$props.panActivationKey;
					},

					get multiSelectionKey() {
						return $$props.multiSelectionKey;
					},

					get zoomActivationKey() {
						return $$props.zoomActivationKey;
					},

					get store() {
						return store;
					},

					set store($$value) {
						store = $$value;
					}
				});

				var node_1 = sibling(node, 2);

				Zoom(node_1, {
					get panOnScrollMode() {
						return panOnScrollMode();
					},

					get preventScrolling() {
						return preventScrolling();
					},

					get zoomOnScroll() {
						return zoomOnScroll();
					},

					get zoomOnDoubleClick() {
						return zoomOnDoubleClick();
					},

					get zoomOnPinch() {
						return zoomOnPinch();
					},

					get panOnScroll() {
						return panOnScroll();
					},

					get panOnScrollSpeed() {
						return panOnScrollSpeed();
					},

					get panOnDrag() {
						return panOnDrag();
					},

					get paneClickDistance() {
						return paneClickDistance();
					},

					get selectionOnDrag() {
						return selectionOnDrag();
					},

					get onmovestart() {
						return $$props.onmovestart;
					},

					get onmove() {
						return $$props.onmove;
					},

					get onmoveend() {
						return $$props.onmoveend;
					},

					get oninit() {
						return $$props.oninit;
					},

					get store() {
						return store;
					},

					set store($$value) {
						store = $$value;
					},

					children: ($$anchor, $$slotProps) => {
						Pane($$anchor, {
							get onpaneclick() {
								return $$props.onpaneclick;
							},

							get onpanecontextmenu() {
								return $$props.onpanecontextmenu;
							},

							get onselectionstart() {
								return $$props.onselectionstart;
							},

							get onselectionend() {
								return $$props.onselectionend;
							},

							get panOnDrag() {
								return panOnDrag();
							},

							get paneClickDistance() {
								return paneClickDistance();
							},

							get selectionOnDrag() {
								return selectionOnDrag();
							},

							get store() {
								return store;
							},

							set store($$value) {
								store = $$value;
							},

							children: ($$anchor, $$slotProps) => {
								var fragment_3 = root_3();
								var node_2 = first_child(fragment_3);

								Viewport(node_2, {
									get store() {
										return store;
									},

									set store($$value) {
										store = $$value;
									},

									children: ($$anchor, $$slotProps) => {
										var fragment_4 = root_4();
										var node_3 = sibling(first_child(fragment_4), 2);

										EdgeRenderer(node_3, {
											get onedgeclick() {
												return $$props.onedgeclick;
											},

											get onedgecontextmenu() {
												return $$props.onedgecontextmenu;
											},

											get onedgepointerenter() {
												return $$props.onedgepointerenter;
											},

											get onedgepointerleave() {
												return $$props.onedgepointerleave;
											},

											get store() {
												return store;
											},

											set store($$value) {
												store = $$value;
											}
										});

										var node_4 = sibling(node_3, 4);

										ConnectionLine(node_4, {
											get type() {
												return connectionLineType();
											},

											get LineComponent() {
												return $$props.connectionLineComponent;
											},

											get containerStyle() {
												return $$props.connectionLineContainerStyle;
											},

											get style() {
												return $$props.connectionLineStyle;
											},

											get store() {
												return store;
											},

											set store($$value) {
												store = $$value;
											}
										});

										var node_5 = sibling(node_4, 2);

										NodeRenderer(node_5, {
											get nodeClickDistance() {
												return nodeClickDistance();
											},

											get onnodeclick() {
												return $$props.onnodeclick;
											},

											get onnodecontextmenu() {
												return $$props.onnodecontextmenu;
											},

											get onnodepointerenter() {
												return $$props.onnodepointerenter;
											},

											get onnodepointermove() {
												return $$props.onnodepointermove;
											},

											get onnodepointerleave() {
												return $$props.onnodepointerleave;
											},

											get onnodedrag() {
												return $$props.onnodedrag;
											},

											get onnodedragstart() {
												return $$props.onnodedragstart;
											},

											get onnodedragstop() {
												return $$props.onnodedragstop;
											},

											get store() {
												return store;
											},

											set store($$value) {
												store = $$value;
											}
										});

										var node_6 = sibling(node_5, 2);

										NodeSelection(node_6, {
											get onselectionclick() {
												return $$props.onselectionclick;
											},

											get onselectioncontextmenu() {
												return $$props.onselectioncontextmenu;
											},

											get onnodedrag() {
												return $$props.onnodedrag;
											},

											get onnodedragstart() {
												return $$props.onnodedragstart;
											},

											get onnodedragstop() {
												return $$props.onnodedragstop;
											},

											get store() {
												return store;
											},

											set store($$value) {
												store = $$value;
											}
										});
										append($$anchor, fragment_4);
									},
									$$slots: { default: true }
								});

								var node_7 = sibling(node_2, 2);

								{
									let $0 = user_derived(() => !!(store.selectionRect && store.selectionRectMode === 'user'));
									let $1 = user_derived(() => store.selectionRect?.width);
									let $2 = user_derived(() => store.selectionRect?.height);
									let $3 = user_derived(() => store.selectionRect?.x);
									let $4 = user_derived(() => store.selectionRect?.y);

									Selection(node_7, {
										get isVisible() {
											return get$2($0);
										},

										get width() {
											return get$2($1);
										},

										get height() {
											return get$2($2);
										},

										get x() {
											return get$2($3);
										},

										get y() {
											return get$2($4);
										}
									});
								}

								append($$anchor, fragment_3);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});

				var node_8 = sibling(node_1, 2);

				Attribution(node_8, {
					get proOptions() {
						return $$props.proOptions;
					},

					get position() {
						return $$props.attributionPosition;
					}
				});

				var node_9 = sibling(node_8, 2);

				A11yDescriptions(node_9, {
					get store() {
						return store;
					}
				});

				var node_10 = sibling(node_9, 2);

				snippet(node_10, () => $$props.children ?? noop$1);
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});

		pop();
	}

	// src/HuEvaFlowEnhancer.js
	class HuEvaFlowEnhancer {
	    constructor() {
	        // Dynamically import HuEvaApi when needed
	        this.api = new (eval('require("./HuEvaApi.js").then(m => m.HuEvaApi)'))({
	            useMock: typeof window !== 'undefined' && window.location.hostname.includes('localhost')
	        });
	        this.container = null;
	        this.originalWorkflowElement = null;
	        this.currentView = 'enhanced'; // Set to 'enhanced' by default
	        this.workflowData = null;

	        console.log('HuEvaFlowEnhancer: Initialized');
	    }

	    initialize() {
	        console.log('HuEvaFlowEnhancer: Starting initialization');

	        this.waitForWorkflowElement().then(() => {
	            console.log('HuEvaFlowEnhancer: Workflow element found, proceeding with initialization');
	            this.setupContainer();
	            this.createTabsInterface();
	            this.loadAndDisplayWorkflow();
	        }).catch(error => {
	            console.error('HuEvaFlowEnhancer: Error during initialization:', error);
	        });
	    }

	    waitForWorkflowElement() {
	        return new Promise((resolve, reject) => {
	            // Check if we're in dev mode and have a stored workflow element
	            if (typeof window !== 'undefined' && window.storedWorkflowElement) {
	                this.originalWorkflowElement = window.storedWorkflowElement;
	                resolve(this.originalWorkflowElement);
	                return;
	            }

	            const checkForElement = () => {
	                const workflowElement = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');

	                if (workflowElement) {
	                    this.originalWorkflowElement = workflowElement;
	                    resolve(workflowElement);
	                } else {
	                    setTimeout(checkForElement, 500);
	                }
	            };

	            const observer = new MutationObserver((mutationsList) => {
	                for (const mutation of mutationsList) {
	                    if (mutation.type === 'childList') {
	                        const workflowElement = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');

	                        if (workflowElement) {
	                            this.originalWorkflowElement = workflowElement;
	                            observer.disconnect();
	                            resolve(workflowElement);
	                            return;
	                        }
	                    }
	                }
	            });

	            observer.observe(document.body, {
	                childList: true,
	                subtree: true
	            });

	            checkForElement();

	            setTimeout(() => {
	                observer.disconnect();
	                reject(new Error('Workflow element not found after timeout'));
	            }, 10000);
	        });
	    }

	    setupContainer() {
	        this.container = document.createElement('div');
	        this.container.id = 'hu-evateam-workflow-enhancer';
	        this.container.style.width = '100%';
	        this.container.style.height = '100%';

	        const devContainer = document.getElementById('workflow-container');
	        if (devContainer) {
	            devContainer.appendChild(this.container);
	        } else {
	            this.originalWorkflowElement.parentNode.insertBefore(this.container, this.originalWorkflowElement.nextSibling);
	        }

	        console.log('HuEvaFlowEnhancer: Container set up');
	    }

	    createTabsInterface() {
	        const tabContainer = document.createElement('div');
	        tabContainer.className = 'workflow-tabs-container';
	        tabContainer.style.display = 'flex';
	        tabContainer.style.marginBottom = '10px';

	        const originalTab = document.createElement('button');
	        originalTab.id = 'original-workflow-tab';
	        originalTab.textContent = 'Исходный workflow';
	        originalTab.style.flex = '1';
	        originalTab.style.padding = '10px';
	        originalTab.style.border = '1px solid #ccc';
	        originalTab.style.borderRadius = '4px 0 0 4px';
	        originalTab.style.cursor = 'pointer';
	        originalTab.addEventListener('click', () => this.switchView('original'));

	        const enhancedTab = document.createElement('button');
	        enhancedTab.id = 'enhanced-workflow-tab';
	        enhancedTab.textContent = 'Улучшенная схема';
	        enhancedTab.style.flex = '1';
	        enhancedTab.style.padding = '10px';
	        enhancedTab.style.border = '1px solid #ccc';
	        enhancedTab.style.borderLeft = 'none';
	        enhancedTab.style.borderRadius = '0 4px 4px 0';
	        enhancedTab.style.cursor = 'pointer';
	        enhancedTab.addEventListener('click', () => this.switchView('enhanced'));

	        tabContainer.appendChild(originalTab);
	        tabContainer.appendChild(enhancedTab);

	        // Set enhanced tab as active by default
	        enhancedTab.style.backgroundColor = '#e0e0e0';
	        originalTab.style.backgroundColor = '';

	        this.container.appendChild(tabContainer);

	        const originalViewContainer = document.createElement('div');
	        originalViewContainer.id = 'original-workflow-view';
	        originalViewContainer.style.display = 'none';
	        originalViewContainer.appendChild(this.originalWorkflowElement.cloneNode(true));

	        const enhancedViewContainer = document.createElement('div');
	        enhancedViewContainer.id = 'enhanced-workflow-view';
	        enhancedViewContainer.style.display = 'block'; // Show by default
	        enhancedViewContainer.style.width = '100%';
	        enhancedViewContainer.style.height = 'calc(100% - 50px)';

	        this.container.appendChild(originalViewContainer);
	        this.container.appendChild(enhancedViewContainer);

	        this.currentView = 'enhanced';

	        console.log('HuEvaFlowEnhancer: Tabs interface created');
	    }

	    switchView(view) {
	        const originalView = document.getElementById('original-workflow-view');
	        const enhancedView = document.getElementById('enhanced-workflow-view');
	        const originalTab = document.getElementById('original-workflow-tab');
	        const enhancedTab = document.getElementById('enhanced-workflow-tab');

	        if (view === 'original') {
	            originalView.style.display = 'block';
	            enhancedView.style.display = 'none';
	            originalTab.style.backgroundColor = '#e0e0e0';
	            enhancedTab.style.backgroundColor = '';
	            this.currentView = 'original';
	        } else if (view === 'enhanced') {
	            originalView.style.display = 'none';
	            enhancedView.style.display = 'block';

	            if (!enhancedView.hasChildNodes()) {
	                this.renderEnhancedWorkflow(enhancedView);
	            }

	            originalTab.style.backgroundColor = '';
	            enhancedTab.style.backgroundColor = '#e0e0e0';
	            this.currentView = 'enhanced';
	        }

	        console.log(`HuEvaFlowEnhancer: Switched to ${view} view`);
	    }

	    async loadAndDisplayWorkflow() {
	        try {
	            console.log('HuEvaFlowEnhancer: Loading workflow data...');

	            const workflowId = this.extractWorkflowId();

	            if (!workflowId) {
	                throw new Error('Could not extract workflow ID from the page');
	            }

	            this.workflowData = await this.api.getCompleteWorkflowData(workflowId);

	            console.log('HuEvaFlowEnhancer: Workflow data loaded successfully', this.workflowData);

	            if (this.currentView === 'enhanced') {
	                const enhancedView = document.getElementById('enhanced-workflow-view');
	                this.renderEnhancedWorkflow(enhancedView);
	            }
	        } catch (error) {
	            console.error('HuEvaFlowEnhancer: Error loading workflow data:', error);

	            const enhancedView = document.getElementById('enhanced-workflow-view');
	            if (enhancedView) {
	                enhancedView.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: red;">
                        <div>
                            <h3>Error loading workflow</h3>
                            <p>${error.message}</p>
                            <p>Please check the console for more details.</p>
                        </div>
                    </div>
                `;
	            }
	        }
	    }

	    extractWorkflowId() {
	        const possibleElements = [
	            document.querySelector('[data-workflow-id]'),
	            document.querySelector('[id*="workflow"]'),
	            document.querySelector('.cmf-dialog__header .title'),
	            document.querySelector('#cdk-overlay-1 .title')
	        ];

	        for (const element of possibleElements) {
	            if (element) {
	                const idAttr = element.getAttribute('data-workflow-id') ||
	                              element.getAttribute('id') ||
	                              element.getAttribute('data-id');

	                if (idAttr && idAttr.includes('CmfWorkflow')) {
	                    return idAttr;
	                }

	                const text = element.textContent || element.innerText;
	                const workflowIdMatch = text.match(/CmfWorkflow:[a-f0-9-]+/i);
	                if (workflowIdMatch) {
	                    return workflowIdMatch[0];
	                }
	            }
	        }

	        if (this.originalWorkflowElement) {
	            let parent = this.originalWorkflowElement.parentElement;
	            while (parent && parent !== document.body) {
	                const parentId = parent.getAttribute('id');
	                if (parentId && parentId.includes('CmfWorkflow')) {
	                    return parentId;
	                }

	                const dataWorkflowId = parent.getAttribute('data-workflow-id');
	                if (dataWorkflowId) {
	                    return dataWorkflowId;
	                }

	                parent = parent.parentElement;
	            }
	        }

	        if (this.api.config.useMock) {
	            return 'CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e';
	        }

	        return null;
	    }

	    renderEnhancedWorkflow(container) {
	        // Check if SvelteFlow is available
	        if (typeof window.SvelteFlow === 'undefined') {
	            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <div>
                        <h3>SvelteFlow not loaded</h3>
                        <p>Please ensure SvelteFlow is properly loaded via the bundled script.</p>
                    </div>
                </div>
            `;
	            return;
	        }

	        container.innerHTML = '';

	        try {
	            const { nodes, edges } = this.prepareSvelteFlowData();

	            // Create a container for the SvelteFlow component
	            const flowContainer = document.createElement('div');
	            flowContainer.style.width = '100%';
	            flowContainer.style.height = '100%';
	            container.appendChild(flowContainer);

	            // Create the SvelteFlow component instance
	            const flowInstance = new window.SvelteFlow({
	                target: flowContainer,
	                props: {
	                    nodes: nodes,
	                    edges: edges,
	                    fitView: true,
	                    defaultViewport: { x: 0, y: 0, zoom: 1 },
	                    onNodeDragStop: (event, node) => {
	                        console.log('HuEvaFlowEnhancer: Node dragged', node);
	                    }
	                }
	            });

	            console.log('HuEvaFlowEnhancer: Enhanced workflow rendered successfully with SvelteFlow');
	        } catch (error) {
	            console.error('HuEvaFlowEnhancer: Error rendering enhanced workflow:', error);
	            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: red;">
                    <div>
                        <h3>Error rendering enhanced workflow</h3>
                        <p>${error.message}</p>
                        <p>Please check the console for more details.</p>
                    </div>
                </div>
            `;
	        }
	    }

	    prepareSvelteFlowData() {
	        if (!this.workflowData) {
	            throw new Error('Workflow data not loaded');
	        }

	        const { workflow, statuses, transitions } = this.workflowData;
	        const nodes = [];
	        const edges = [];

	        statuses.forEach((status, index) => {
	            let position = { x: 100, y: 100 };

	            if (workflow.scheme_draw_config) {
	                const configKey = `${status.id}_draw_scheme_item`;
	                const config = workflow.scheme_draw_config[configKey];

	                if (config) {
	                    position = { x: config.x, y: config.y };
	                }
	            }

	            if (position.x === 100 && position.y === 100) {
	                const cols = 4;
	                const row = Math.floor(index / cols);
	                const col = index % cols;
	                position = {
	                    x: 200 + col * 250,
	                    y: 150 + row * 200
	                };
	            }

	            const bgColor = this.hexToRgbA(status.color, 0.15) || '#ffffff';
	            const borderColor = this.adjustColorLightness(status.color, -20) || '#000000';
	            const textColor = this.adjustColorLightness(status.color, -80) || '#000000';

	            const node = {
	                id: status.id,
	                type: 'default',
	                position,
	                data: {
	                    label: status.name,
	                    description: status.text || '',
	                    color: status.color,
	                    statusType: status.status_type
	                },
	                style: {
	                    backgroundColor: bgColor,
	                    borderColor: borderColor,
	                    color: textColor,
	                    border: `2px solid ${borderColor}`,
	                    borderRadius: '6px',
	                    padding: '10px',
	                    fontSize: '14px',
	                    fontWeight: 'bold',
	                    minWidth: '120px',
	                    minHeight: '60px',
	                    display: 'flex',
	                    alignItems: 'center',
	                    justifyContent: 'center',
	                    textAlign: 'center'
	                },
	                sourcePosition: 'right',
	                targetPosition: 'left',
	                draggable: true
	            };

	            if (status.name.toLowerCase().includes('старт') || status.code === 'start') {
	                node.style.borderRadius = '50%';
	                node.style.minWidth = '60px';
	                node.style.minHeight = '60px';
	            }

	            nodes.push(node);
	        });

	        transitions.forEach(transition => {
	            transition.status_from.forEach(fromStatus => {
	                const edge = {
	                    id: `${fromStatus.id}-${transition.status_to.id}`,
	                    source: fromStatus.id,
	                    target: transition.status_to.id,
	                    type: 'smoothstep',
	                    label: transition.name.trim(),
	                    animated: false,
	                    style: {
	                        stroke: '#456',
	                        strokeWidth: 2
	                    },
	                    labelStyle: {
	                        fill: '#456',
	                        fontWeight: 600,
	                        fontSize: '12px'
	                    },
	                    markerEnd: {
	                        type: 'arrowclosed',
	                        color: '#456'
	                    }
	                };

	                edges.push(edge);
	            });
	        });

	        console.log('HuEvaFlowEnhancer: Prepared SvelteFlow data', { nodes, edges });

	        return { nodes, edges };
	    }

	    hexToRgbA(hex, alpha = 1) {
	        if (!hex) return null;

	        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
	            return r + r + g + g + b + b;
	        });

	        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	        return result ?
	            `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` :
	            null;
	    }

	    adjustColorLightness(hex, percent) {
	        if (!hex) return null;

	        hex = hex.replace(/^\s*#|\s*$/g, '');

	        let r = parseInt(hex.substr(0, 2), 16);
	        let g = parseInt(hex.substr(2, 2), 16);
	        let b = parseInt(hex.substr(4, 2), 16);

	        r = Math.min(255, Math.max(0, r + r * (percent / 100)));
	        g = Math.min(255, Math.max(0, g + g * (percent / 100)));
	        b = Math.min(255, Math.max(0, b + b * (percent / 100)));

	        r = Math.round(r).toString(16).padStart(2, '0');
	        g = Math.round(g).toString(16).padStart(2, '0');
	        b = Math.round(b).toString(16).padStart(2, '0');

	        return `#${r}${g}${b}`;
	    }
	}

	// src/HuEvaApi.js
	class HuEvaApi {
	    constructor(config = {}) {
	        this.config = {
	            baseUrl: 'https://eva.gid.team/api/',
	            mockUrls: {
	                'CmfWorkflow.get': 'http://localhost:3000/makets/api/api__m=CmfWorkflow.get:response.json',
	                'CmfTrans.list': 'http://localhost:3000/makets/api/api__m=CmfTrans.list:response.json',
	                'CmfStatus.list': 'http://localhost:3000/makets/api/api__m=CmfStatus.list:response.json'
	            },
	            useMock: typeof config.useMock !== 'undefined' ? config.useMock : false,
	            ...config
	        };
	    }

	    async call(method, params = {}) {
	        try {
	            let url;
	            if (this.config.useMock && this.config.mockUrls[method]) {
	                url = this.config.mockUrls[method];
	            } else {
	                url = `${this.config.baseUrl}?m=${method}`;

	                const queryParams = new URLSearchParams({ m: method });
	                for (const [key, value] of Object.entries(params)) {
	                    queryParams.append(key, value);
	                }
	                url = `${this.config.baseUrl}?${queryParams.toString()}`;
	            }

	            console.log(`HuEvaFlowEnhancer: Calling API method ${method} with URL: ${url}`);

	            const response = await fetch(url, {
	                method: 'GET',
	                headers: {
	                    'Content-Type': 'application/json',
	                },
	                credentials: 'include'
	            });

	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }

	            const data = await response.json();

	            console.log(`HuEvaFlowEnhancer: API call ${method} successful`, data);

	            return data;
	        } catch (error) {
	            console.error(`HuEvaFlowEnhancer: Error calling API method ${method}:`, error);
	            throw error;
	        }
	    }

	    async getWorkflow(workflowId) {
	        const params = {};
	        if (workflowId) {
	            params.id = workflowId;
	        }

	        const response = await this.call('CmfWorkflow.get', params);
	        return response.result;
	    }

	    async getTransitions(workflowId) {
	        const params = {};
	        if (workflowId) {
	            params.workflow_id = workflowId;
	        }

	        const response = await this.call('CmfTrans.list', params);
	        return response.result;
	    }

	    async getStatuses(workflowId) {
	        const params = {};
	        if (workflowId) {
	            params.workflow_id = workflowId;
	        }

	        const response = await this.call('CmfStatus.list', params);
	        return response.result;
	    }

	    async getCompleteWorkflowData(workflowId) {
	        try {
	            console.log(`HuEvaFlowEnhancer: Getting complete workflow data for workflow ID: ${workflowId}`);

	            const [workflow, statuses, transitions] = await Promise.all([
	                this.getWorkflow(workflowId),
	                this.getStatuses(workflowId),
	                this.getTransitions(workflowId)
	            ]);

	            return {
	                workflow,
	                statuses,
	                transitions
	            };
	        } catch (error) {
	            console.error(`HuEvaFlowEnhancer: Error getting complete workflow data:`, error);
	            throw error;
	        }
	    }
	}

	// src/main.js

	// Export SvelteFlow globally for use in Tampermonkey script
	if (typeof window !== 'undefined') {
	  window.SvelteFlow = SvelteFlow;
	}

	exports.HuEvaApi = HuEvaApi;
	exports.HuEvaFlowEnhancer = HuEvaFlowEnhancer;

	return exports;

})({});
