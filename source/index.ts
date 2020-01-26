import {Moment, unitOfTime} from 'moment';
import * as moment from 'moment';

interface RangeOptions {
	step: number;
	unit: string;
}

interface IteratorOptions extends RangeOptions {
	start: Moment;
	end?: Moment;
}

function isMoment(value: Partial<RangeOptions> | Moment | undefined): value is Moment {
	if (!value) {
		return false;
	}

	return (value as any).format
}

function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw Error(message);
	}
}

function* dateIterator(options: IteratorOptions): Generator<Moment> {
	const {start, end, step, unit} = options;

	let rangeStart = moment(start);

	// TODO: Work with moving backwards
	while (!end || rangeStart.isSameOrBefore(end)) {
		yield moment(rangeStart);

		// Check what happens when adding negative numbers
		rangeStart = moment(rangeStart).add(step, unit as unitOfTime.DurationConstructor);
	}
}

export function range(start: Moment, rangeOptions?: Partial<RangeOptions>): Generator;
export function range(start: Moment, end: Moment, rangeOptions?: Partial<RangeOptions>): Generator;
export function range(
	start: Moment,
	end?: Moment | Partial<RangeOptions>,
	rangeOptions?: Partial<RangeOptions>
): Generator {
	let rangeEnd: Moment | undefined;
	let opts: Partial<RangeOptions> = rangeOptions ?? {};

	if (isMoment(end)) {
		rangeEnd = end;
	} else {
		opts = end ?? {}
	}

	const options = {
		step: 1,
		unit: 'd',
		...opts,
	}

	assert(options.step !== 0, '`step` cannot be `0`');
	assert(Number.isInteger(options.step), '`step` must be an integer');

	if (rangeEnd) {
		assert(
			options.step > 0 && start.isAfter(rangeEnd),
			'`start` needs to be before `end`'
		);
		assert(
			options.step < 0 && start.isBefore(rangeEnd),
			'`end` needs to be before `after`'
		);
	}

	return dateIterator({
		...options,
		start,
		end: rangeEnd
	});
}
