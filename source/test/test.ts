import test from 'ava';
import {Moment} from 'moment';
import * as moment from 'moment';
import {range} from '..';

test('should fail on validation', t => {
	t.throws(() => range(moment('2020-01-01'), moment('2019-12-31')), '`start` needs to be before `end`');
	t.throws(() => range(moment('2020-01-01'), moment('2020-02-01'), {step: -1}), '`start` needs to be after `end`');
	t.throws(() => range(moment('2020-01-01'), moment('2020-01-31'), {step: 0}), '`step` cannot be `0`');
});

test('should iterate forward with the default options', t => {
	const iterator = range(moment('2020-01-01'));

	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-01');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-02');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-03');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-04');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-05');
});

test('should iterate forward with a defined step', t => {
	const iterator = range(moment('2020-01-01'), {step: 2});

	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-01');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-03');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-05');
});

test('should iterate forward with a defined step and unit', t => {
	const iterator = range(moment('2020-01-01'), {unit: 'w'});

	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-01');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-08');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-15');
});

test('should iterate forward with defined unit and end', t => {
	const iterator = range(moment('2020-01-01'), moment('2020-01-18'), {unit: 'w'});

	const dates = Array.from<Moment>(iterator).map<string>(item => item.format('YYYY-MM-DD'));

	t.deepEqual(dates, ['2020-01-01', '2020-01-08', '2020-01-15']);
});

test('should iterate in a specific range', t => {
	const iterator = range(moment('2020-01-01'), moment('2020-01-10'));

	const dates = Array.from<Moment>(iterator).map<string>(item => item.format('YYYY-MM-DD'));

	t.deepEqual(dates, [
		'2020-01-01',
		'2020-01-02',
		'2020-01-03',
		'2020-01-04',
		'2020-01-05',
		'2020-01-06',
		'2020-01-07',
		'2020-01-08',
		'2020-01-09',
		'2020-01-10'
	]);
});

test('should iterate if start and end are the same', t => {
	const iterator = range(moment('2020-01-01'), moment('2020-01-01'));

	const dates = Array.from<Moment>(iterator).map<string>(item => item.format('YYYY-MM-DD'));

	t.deepEqual(dates, ['2020-01-01']);
});

test('should iterate if start and end are the same and step is negative', t => {
	const iterator = range(moment('2020-01-01'), moment('2020-01-01'), {step: -1});

	const dates = Array.from<Moment>(iterator).map<string>(item => item.format('YYYY-MM-DD'));

	t.deepEqual(dates, ['2020-01-01']);
});

test('should iterate backwards', t => {
	const iterator = range(moment('2020-01-31'), {step: -1});

	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-31');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-30');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-29');
});

test('should iterate in a specific range backwards', t => {
	const iterator = range(moment('2020-01-31'), moment('2020-01-20'), {step: -1, unit: 'w'});

	const dates = Array.from<Moment>(iterator).map<string>(item => item.format('YYYY-MM-DD'));

	t.deepEqual(dates, ['2020-01-31', '2020-01-24']);
});
