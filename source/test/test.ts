import test from 'ava';
import * as moment from 'moment';
import {range} from '..';

test('should fail on validation', t => {
	t.throws(() => range(moment('2020-01-01'), moment('2019-12-31')), '`end` needs to be before `after`');
	t.throws(() => range(moment('2020-01-01'), moment('2019-12-31'), {step: -1}), '`start` needs to be before `end`');
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
	const iterator = range(moment('2020-01-01'), {step: 1, unit: 'w'});

	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-01');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-08');
	t.is(iterator.next().value.format('YYYY-MM-DD'), '2020-01-15');
});
