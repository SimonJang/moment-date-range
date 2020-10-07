import * as moment from 'moment';
import {Moment, unitOfTime} from './types';

interface RangeOptions {
	/**
	 * Number of units between each iteration. Default `1`
	 */
	step: number;
	/**
	 * Unit used during iteration. Default `d`
	 */
	unit: unitOfTime.DurationConstructor;
}

interface IteratorOptions extends RangeOptions {
	start: Moment;
	end?: Moment;
}

function isValidRange(step: number, start: Moment, end: Moment | undefined): [boolean, string] {
	if (end === undefined) {
		return [true, ''];
	}

	if (step > 0) {
		return [start.isSameOrBefore(end), '`start` needs to be before `end`'];
	}

	if (step < 0) {
		return [start.isSameOrAfter(end), '`start` needs to be after `end`'];
	}

	return [false, 'Unknown condition'];
}

function isMoment(value: Partial<RangeOptions> | Moment | undefined): value is Moment {
	if (!value) {
		return false;
	}

	return !!((value as unknown) as Moment).format;
}

function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw Error(message);
	}
}

function* dateIterator(options: IteratorOptions): Generator<Moment> {
	const {start, end, step, unit} = options;

	let rangeStart = moment(start);

	const fnName = step > 0 ? 'isSameOrBefore' : 'isSameOrAfter';

	while (!end || rangeStart[fnName](end)) {
		yield moment(rangeStart);

		rangeStart = moment(rangeStart).add(step, unit);
	}
}

/**
 * Calculate a range from a start date.
 *
 * @param start - Starting date.
 * @param rangeOptions - Configuration options.
 */
export function range(start: Moment, rangeOptions?: Partial<RangeOptions>): Generator<Moment>;
export function range(start: Moment, end: Moment, rangeOptions?: Partial<RangeOptions>): Generator<Moment>;
export function range(start: Moment, end?: Moment | Partial<RangeOptions>, rangeOptions?: Partial<RangeOptions>): Generator<Moment> {
	let rangeEnd: Moment | undefined;
	let opts = rangeOptions ?? {};

	if (isMoment(end)) {
		rangeEnd = end;
	} else {
		opts = end ?? {};
	}

	const options = {
		step: 1,
		unit: 'd' as unitOfTime.DurationConstructor,
		...opts
	};

	assert(options.step !== 0, '`step` cannot be `0`');
	assert(Number.isInteger(options.step), '`step` must be an integer');
	assert(...isValidRange(options.step, start, rangeEnd));

	return dateIterator({
		...options,
		start,
		end: rangeEnd
	});
}
