scope to a verified paying contact or executing a direct USDC bounty receipt. No further infrastructure.';
  } else if (score >= 5) {
    title.textContent = 'Possible fit — review the format first';
    copy.textContent = 'The workflow may fit, but readability, table complexity, or unclear columns need a manual compatibility review before quoting.';
    price.textContent = `Indicative ceiling for the first test: ${suggestedPrice}`;
    next.textContent = 'Next: use a synthetic or strongly redacted example to clarify the layout and desired output, prioritizing immediate cashflow potential.';
  } else {
    title.textContent = 'Not ready for a fixed-scope starter test';
    copy.textContent = 'The current format may require interpretation or a larger discovery step, so a low-cost fixed deliverable would be risky.';
    price.textContent = 'No price should be offered until the format is reviewed.';
    next.textContent = 'Next: focus exclusively on verified revenue-producing actions with zero upfront spend (no Upwork connects, respect AgentMail suppression).';
  }

  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});