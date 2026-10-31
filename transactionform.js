
let transactions = [];

try {
  const saved = JSON.parse(localStorage.getItem('transactions'));

  if (Array.isArray(saved)) {
    transactions = saved;
  }
} catch (error) {
  console.error('Could not load saved transactions:', error);
}


let transactionform = document.getElementById('transactionform');
const desc = document.getElementById('desc');
const amt = document.getElementById('amt');
const type = document.getElementById('type');
const category = document.getElementById('category');
const date = document.getElementById('date');
const categoryOptions = {
  expense: [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transport' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'housing', label: 'Housing & Rent' },
    { value: 'personal-care', label: 'Personal Care' },
    { value: 'other', label: 'Other' }
  ],
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Business' },
    { value: 'investment', label: 'Investment' },
    { value: 'gift', label: 'Gift' },
    { value: 'refund', label: 'Refund' },
    { value: 'other', label: 'Other' }
  ]
};

function updateCategoryOptions() {
  const options = categoryOptions[type.value] || [];
  category.innerHTML =
    '<option value="" selected disabled>Choose category</option>';
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    category.appendChild(option);
  });
}

type.addEventListener('change', updateCategoryOptions);

const query = new URLSearchParams(location.search);

const editId = query.get('id');
if (editId) {
  const transactionDetails = transactions.find(trans => String(trans.id) === editId);

  if (!transactionDetails) {
    alert("Transaction not found.");
    location.href = 'index.html';
  } else {
    desc.value = transactionDetails.description;
    amt.value = transactionDetails.amount;
    type.value = transactionDetails.type;
    updateCategoryOptions();
    category.value = transactionDetails.category;
    date.value = transactionDetails.date;
    document.getElementById('formTitle').textContent = 'Edit Transaction';

    document.getElementById('submitBtn').innerHTML =
      '<i class="fa-solid fa-check mr-2 text-xs"></i> Update Transaction';
  }

}
if (!editId) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  date.value = `${yyyy}-${mm}-${dd}`;
}



transactionform.addEventListener('submit', (event) => {
  event.preventDefault();
  const description = desc.value.trim();
  const amountInput = amt.value.trim();
  const transactionType = type.value;
  const transactionCategory = category.value;
  const transactionDate = date.value;
  if (
    !description ||
    !amountInput ||
    !transactionType ||
    !transactionCategory ||
    !transactionDate
  ) {
    alert("Please fill all fields completely!");
    return;
  }

  const validAmountFormat =
    /^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(amountInput);

  if (!validAmountFormat) {
    alert("Please enter a valid amount, e.g. 3000 or 3,000.");
    return;
  }

  const amount = Number(amountInput.replace(/,/g, ''));
  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than ₹0.");
    return;
  }


  if (editId) {
    const transactionDetails = transactions.find(
      trans => String(trans.id) === editId
    );

    if (!transactionDetails) {
      alert("Transaction not found.");
      return;
    }

    transactionDetails.description = description;
    transactionDetails.amount = amount;
    transactionDetails.type = transactionType;
    transactionDetails.category = transactionCategory;
    transactionDetails.date = transactionDate;

  } else {
    transactions.push({
      id: Date.now(),
      description,
      amount,
      type: transactionType,
      category: transactionCategory,
      date: transactionDate
    });
  }

  try {
    localStorage.setItem(
      'transactions',
      JSON.stringify(transactions)
    );

    location.href = 'index.html';
  } catch (error) {
    console.error('Could not save transaction:', error);
    alert('Unable to save transaction. Please check your browser storage.');
  }
});



