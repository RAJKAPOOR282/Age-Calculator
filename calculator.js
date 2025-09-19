const dobInput = document.getElementById('dob');
const targetDateInput = document.getElementById('targetDate');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const resultSection = document.getElementById('result-section');
const errorMessage = document.getElementById('error-message');

const dobError = document.getElementById('dobError');
const targetDateError = document.getElementById('targetDateError');

const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');
const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');

const nextBdayDateSpan = document.getElementById('next-bday-date');
const nextBdayWeekdaySpan = document.getElementById('next-bday-weekday');
const countdownDaysSpan = document.getElementById('countdown-days');
const countdownHoursSpan = document.getElementById('countdown-hours');
const countdownMinutesSpan = document.getElementById('countdown-minutes');
const countdownSecondsSpan = document.getElementById('countdown-seconds');

const birthDaySpan = document.getElementById('birth-day');
const milestonesDiv = document.getElementById('milestones');
const totalDaysSpan = document.getElementById('total-days');

let liveTimer = null;

// Default target date to today on load
targetDateInput.valueAsDate = new Date();

calculateBtn.addEventListener('click', () => {
  clearErrors();
  if (validateInputs()) {
    calculateAndDisplay();
  }
});
resetBtn.addEventListener('click', resetAll);
copyBtn.addEventListener('click', copyResults);

// Input validation with inline feedback
function validateInputs() {
  let valid = true;
  if (!dobInput.value) {
    dobError.textContent = 'Birth date is required';
    dobError.classList.remove('hidden');
    valid = false;
  }
  if (!targetDateInput.value) {
    targetDateError.textContent = 'Target date is required';
    targetDateError.classList.remove('hidden');
    valid = false;
  }
  if (dobInput.value && targetDateInput.value) {
    if (new Date(dobInput.value) > new Date(targetDateInput.value)) {
      errorMessage.textContent = 'Birth date cannot be after the target date.';
      valid = false;
    }
  }
  return valid;
}

function clearErrors() {
  dobError.classList.add('hidden');
  dobError.textContent = '';
  targetDateError.classList.add('hidden');
  targetDateError.textContent = '';
  errorMessage.textContent = '';
}

function calculateAndDisplay() {
  clearInterval(liveTimer);
  resultSection.classList.add('opacity-0', 'translate-y-6');
  resultSection.classList.add('hidden');

  const birthDate = new Date(dobInput.value);
  const targetDate = new Date(targetDateInput.value);

  // Show static age initially
  calculateStaticAge(birthDate, targetDate);
  displayBirthDetails(birthDate, targetDate);

  // Update the live part every second
  liveTimer = setInterval(() => updateLiveClocks(birthDate), 1000);
  updateLiveClocks(birthDate);

  resultSection.classList.remove('hidden');
  setTimeout(() => {
    resultSection.classList.remove('opacity-0', 'translate-y-6');
  }, 100);

  copyBtn.classList.remove('hidden');
}

function calculateStaticAge(birthDate, targetDate) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    let prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  yearsSpan.textContent = years;
  monthsSpan.textContent = months;
  daysSpan.textContent = days;
}

function displayBirthDetails(birthDate, targetDate) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  birthDaySpan.textContent = daysOfWeek[birthDate.getDay()];
  totalDaysSpan.textContent = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24)).toLocaleString();

  const age18 = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
  const age21 = new Date(birthDate.getFullYear() + 21, birthDate.getMonth(), birthDate.getDate());
  milestonesDiv.innerHTML = '';
  if (targetDate >= age18) milestonesDiv.innerHTML += `<p>✔️ Reached 18 years (Adult)</p>`;
  else milestonesDiv.innerHTML += `<p>❌ Not yet 18 years old</p>`;
  if (targetDate >= age21) milestonesDiv.innerHTML += `<p>✔️ Reached 21 years</p>`;
  else milestonesDiv.innerHTML += `<p>❌ Not yet 21 years old</p>`;
}

function updateLiveClocks(birthDate) {
  const now = new Date();

  const diff = now - birthDate;
  hoursSpan.textContent = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  minutesSpan.textContent = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
  secondsSpan.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  [hoursSpan.parentElement, minutesSpan.parentElement, secondsSpan.parentElement].forEach(box => {
    box.classList.remove('shake');
    void box.offsetWidth;
    box.classList.add('shake');
  });

  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  let year = now.getFullYear();

  if (now.getMonth() > month || (now.getMonth() === month && now.getDate() >= day)) {
    year++;
  }

  const nextBirthday = new Date(year, month, day);
  const remaining = nextBirthday - now;

  if (remaining > 0) {
    countdownDaysSpan.textContent = Math.floor(remaining / (1000 * 60 * 60 * 24));
    countdownHoursSpan.textContent = String(Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    countdownMinutesSpan.textContent = String(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    countdownSecondsSpan.textContent = String(Math.floor((remaining % (1000 * 60)) / 1000)).padStart(2, '0');
  } else {
    countdownDaysSpan.textContent = "0";
    countdownHoursSpan.textContent = "00";
    countdownMinutesSpan.textContent = "00";
    countdownSecondsSpan.textContent = "00";
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  nextBdayDateSpan.textContent = nextBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  nextBdayWeekdaySpan.textContent = daysOfWeek[nextBirthday.getDay()];
}

function copyResults() {
  const resultsText = `
Age Calculation Results
-----------------------
Date of Birth: ${new Date(dobInput.value).toLocaleDateString()}
As of: ${new Date(targetDateInput.value).toLocaleDateString()}
Age: ${yearsSpan.textContent} years, ${monthsSpan.textContent} months, ${daysSpan.textContent} days
Born on: ${birthDaySpan.textContent}
Total Days Lived: ${totalDaysSpan.textContent}
Next Birthday: ${nextBdayDateSpan.textContent} (${nextBdayWeekdaySpan.textContent})
  `;
  navigator.clipboard.writeText(resultsText.trim()).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy Results';
    }, 2000);
  });
}

function resetAll() {
  clearInterval(liveTimer);
  dobInput.value = '';
  targetDateInput.valueAsDate = new Date();
  yearsSpan.textContent = '--';
  monthsSpan.textContent = '--';
  daysSpan.textContent = '--';
  hoursSpan.textContent = '--';
  minutesSpan.textContent = '--';
  secondsSpan.textContent = '--';
  nextBdayDateSpan.textContent = '---';
  nextBdayWeekdaySpan.textContent = '---';
  countdownDaysSpan.textContent = '--';
  countdownHoursSpan.textContent = '--';
  countdownMinutesSpan.textContent = '--';
  countdownSecondsSpan.textContent = '--';
  birthDaySpan.textContent = '---';
  totalDaysSpan.textContent = '---';
  milestonesDiv.innerHTML = '---';
  copyBtn.classList.add('hidden');
  resultSection.classList.add('hidden');
  errorMessage.textContent = '';
  clearErrors();
}
