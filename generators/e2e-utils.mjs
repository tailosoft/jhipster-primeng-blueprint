/**
 * Helpers shared by the e2e sub-generators (cypress and playwright).
 *
 * Both generators consume `field.generateFakeData('cypress')`: the `cypress` flavour is the
 * "what a human would type in the form" flavour, so it is the right one for playwright too.
 * JHipster emits ISO dates there, while the primeng widgets expect the `MM/DD/YYYY` locale
 * format, hence the patch below.
 */

/**
 * `testFrameworks` value opting an application into the playwright suite. jhipster core does not
 * know it, so it is this blueprint's `client` generator that composes the sub-generator.
 */
export const PLAYWRIGHT = 'playwright';

const PATCHED = Symbol.for('primeng-blueprint:fake-data-patched');

const isDateField = field => ['Instant', 'ZonedDateTime', 'LocalDate'].includes(field.fieldType);

/**
 * Reformat a JHipster ISO fake date to the format the primeng date pickers render.
 *
 * `2025-12-28T09:54` -> `12/28/2025 09:54`, `2025-12-28` -> `12/28/2025`.
 */
export const formatDateForPrimeng = isoDate => {
  if (isoDate.includes('T')) {
    const [datePart, timePart] = isoDate.split('T');
    const [year, month, day] = datePart.split('-');
    return `${month}/${day}/${year} ${timePart}`;
  }
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
};

/**
 * Wrap `field.generateFakeData` so date values match the primeng widgets.
 *
 * Idempotent: cypress and playwright can both be enabled, and each one calls this on every
 * field. Applying the transform twice would corrupt the already reformatted date.
 */
export const patchFakeDataForPrimeng = field => {
  if (field[PATCHED] || !isDateField(field)) return;
  field[PATCHED] = true;

  const originalGenerateFakeData = field.generateFakeData;
  field.generateFakeData = (type = 'csv') => {
    const data = originalGenerateFakeData(type);
    if (type === 'cypress' && data) {
      return formatDateForPrimeng(data);
    }
    return data;
  };
};
