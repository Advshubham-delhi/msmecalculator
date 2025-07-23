function addRow() {
  const container = document.getElementById('principal-entries');
  const div = document.createElement('div');
  div.className = 'principal-row';
  div.innerHTML = `
    <input type="number" placeholder="Principal Amount (₹)" class="principal" />
    <input type="date" class="due-date" title="Date of Invoice + 45 days" />
  `;
  container.appendChild(div);
}

function calculateInterest(principal, rate, months, compounding) {
  let interest = 0;
  if (compounding === "monthly") {
    const monthlyRate = rate / 12 / 100;
    interest = principal * Math.pow(1 + monthlyRate, months) - principal;
  } else {
    const yearlyRate = rate / 100;
    const years = months / 12;
    interest = principal * Math.pow(1 + yearlyRate, years) - principal;
  }
  return interest;
}

document.getElementById('calculate').addEventListener('click', () => {
  const rate = parseFloat(document.getElementById('interestRate').value);
  const compounding = document.getElementById('compounding').value;
  const endDate = new Date(document.getElementById('endDate').value);
  let totalInterest = 0;
  let tableRows = [];
  let slNo = 1;

  document.querySelectorAll('.principal-row').forEach(row => {
    const principal = parseFloat(row.querySelector('.principal').value);
    const startDate = new Date(row.querySelector('.due-date').value);
    if (isNaN(principal) || !startDate || isNaN(startDate)) return;

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                   (endDate.getMonth() - startDate.getMonth());
    const interest = calculateInterest(principal, rate, months, compounding);
    totalInterest += interest;

    const interestUpto = endDate.toISOString().split("T")[0];
    tableRows.push(`
      <tr>
        <td>${slNo++}</td>
        <td>₹${principal.toFixed(2)}</td>
        <td>${startDate.toISOString().split("T")[0]}</td>
        <td>${interestUpto}</td>
        <td>₹${interest.toFixed(2)}</td>
      </tr>
    `);
  });

  const totalPrincipal = Array.from(document.querySelectorAll('.principal'))
    .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
  const totalClaim = totalPrincipal + totalInterest;

  const tableHTML = `
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>Sl No.</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Interest Upto</th>
          <th>Interest</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows.join("")}
        <tr><td colspan="4"><strong>Total Interest</strong></td><td><strong>₹${totalInterest.toFixed(2)}</strong></td></tr>
        <tr><td colspan="4"><strong>Total Claim Amount</strong></td><td><strong>₹${totalClaim.toFixed(2)}</strong></td></tr>
      </tbody>
    </table>
  `;

  document.getElementById("results").innerHTML = tableHTML;
});

document.getElementById('bankRate').addEventListener('input', () => {
  const bankRate = parseFloat(document.getElementById('bankRate').value);
  if (!isNaN(bankRate)) {
    document.getElementById('interestRate').value = (bankRate * 3).toFixed(2);
  } else {
    document.getElementById('interestRate').value = '';
  }
});

// Set default end date to today
document.getElementById('endDate').valueAsDate = new Date();

// Print button: trigger print and open LinkedIn page
document.getElementById('printBtn').addEventListener('click', function () {
  window.print(); // Trigger print dialog
  window.open("https://www.linkedin.com/company/fs-partners-advocates/", "_blank"); // Open LinkedIn in new tab
});



