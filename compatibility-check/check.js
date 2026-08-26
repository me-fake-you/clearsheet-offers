const form = document.querySelector('#fit-form');
const result = document.querySelector('#fit-result');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const type = document.querySelector('#document-type').value;
  const count = document.querySelector('#count').value;
  const readable = data.get('readable');
  const columns = data.get('columns');
  const tables = data.get('tables');

  let score = 0;
  if (['invoice', 'po', 'freight'].includes(type)) score += 2;
  if (readable === 'yes') score += 2;
  if (readable === 'mixed') score += 1;
  if (columns === 'yes') score += 2;
  if (columns === 'partial') score += 1;
  if (count === 'small') score += 2;
  if (count === 'medium') score += 1;
  if (tables === 'simple') score += 2;
  if (tables === 'mixed') score += 1;

  const title = document.querySelector('#result-title');
  const copy = document.querySelector('#result-copy');
  const price = document.querySelector('#result-price');
  const next = document.querySelector('#result-next');

  let suggestedPrice = '$10 / ¥29';
  if (count === 'medium' || readable === 'mixed' || columns === 'partial' || tables === 'mixed') {
    suggestedPrice = '$20 / ¥49';
  }
  if (count === 'large' || tables === 'complex' || readable === 'no' || columns === 'no') {
    suggestedPrice = '$30 / ¥99';
  }

  if (score >= 8) {
    title.textContent = 'Likely fit for a small starter test';
    copy.textContent = 'Your document type, readability, and first-batch scope look compatible with a narrow Excel deliverable.';
    price.textContent = `Indicative starter-test tier: ${suggestedPrice}`;
    next.textContent = 'Next: list the required columns in the public structure-only form. Do not attach files or include real customer, payment, identity, or proprietary data.';
  } else if (score >= 5) {
    title.textContent = 'Possible fit — review the format first';
    copy.textContent = 'The workflow may fit, but readability, table complexity, or unclear columns need a manual compatibility review before quoting.';
    price.textContent = `Indicative ceiling for the first test: ${suggestedPrice}`;
    next.textContent = 'Next: use a synthetic or strongly redacted example to clarify the layout and desired output.';
  } else {
    title.textContent = 'Not ready for a fixed-scope starter test';
    copy.textContent = 'The current format may require interpretation or a larger discovery step, so a low-cost fixed deliverable would be risky.';
    price.textContent = 'No price should be offered until the format is reviewed.';
    next.textContent = 'Next: define the required columns and improve sample readability before requesting a quote.';
  }

  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
