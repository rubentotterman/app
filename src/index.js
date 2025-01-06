import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { createClient } from '@supabase/supabase-js';


let workoutChart, sleepChart;
let sleepData = {
  actual: 4,
  goal: 8
};


const supabase = createClient('https://ynaebzwplirfhvoxrvnz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA');

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === 'visible') {
    // Get current path and reinitialize that section
    const path = window.location.pathname.slice(1) || 'dashboard';
    if (sections[path]) {
      showSection(path);
    }
  }
});


function initializeCharts() {
  // Destroy existing charts if they exist
  if (workoutChart) workoutChart.destroy();
  if (sleepChart) sleepChart.destroy();

  if (elements.workoutBarChartCanvas) {
    const ctx = elements.workoutBarChartCanvas.getContext("2d");
    workoutChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Calories Intake", "Calories Burned", "Activity Time"],
        datasets: [
          { label: "Workout Metrics", data: [800, 850, 400], backgroundColor: ["#F29559", "#9E2835", "#78e3fd"] },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }

  if (elements.sleepChartCanvas) {
    const sleepCtx = elements.sleepChartCanvas.getContext("2d");
    sleepChart = new Chart(sleepCtx, {
      type: "bar",
      data: {
        labels: ["Actual", "Goal"],
        datasets: [{ label: "Sleep Time", data: [6, 8], backgroundColor: ["#78e3fd", "rgba(255,206,86,0.2)"] }],
      },
      options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } },
    });
  }
}

// Add this function to handle saving sleep data
async function saveSleepData(hoursSlept, startTime, endTime) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert('Please log in to save sleep data');
      return;
    }

    const { data: userData, error: userError } = await supabase
    .from('logify_user_table')
    .select('id')
    .single();

    if (userError || !userData ) {
      //User doesnt exist in logify_user_table, create them
      const { data: newUser, error: createError } = await supabase
      .from('logify_user_table')
      .insert([{ id: session.user.id }])
      .select()
      .single();

    if (createError) throw createError;
    userData = newUser;
    }

    const { data, error } = await supabase
      .from('sleep_records')
      .insert([
        {
          user_id: session.user.id,
          hours_slept: hoursSlept,
          sleep_start: startTime,
          sleep_end: endTime,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    
    // Update chart after successful save
    if (sleepChart) {
      sleepChart.data.datasets[0].data[0] = hoursSlept;
      sleepChart.update();
    }

    return data;
  } catch (error) {
    console.error('Error saving sleep data:', error);
    alert('Failed to save sleep data');
  }
}

// Modify your form submit handler
document.getElementById('sleepTrackerForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const startDate = formData.get('sleep-start-date');
  const startTime = formData.get('sleep-start-time');
  const endDate = formData.get('sleep-end-date');
  const endTime = formData.get('sleep-end-time');
  
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  
  const hoursSlept = (end - start) / (1000 * 60 * 60);
  
  // Save data to Supabase and update chart
  await saveSleepData(hoursSlept, start, end);
});

// Add function to load user's sleep data
async function loadUserSleepData() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { data, error } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const latestRecord = data[0];
      
      if (sleepChart) {
        sleepChart.data.datasets[0].data[0] = latestRecord.hours_slept;
        sleepChart.update();
      }
    }
  } catch (error) {
    console.error('Error loading sleep data:', error);
  }
}

// Call loadUserSleepData when user logs in
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    loadUserSleepData();
  }
});



document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired.");
 

  // Element selections
  const elements = {
    scrollContainer: document.getElementById("scrollContainer"),
    addCardBtn: document.getElementById("addCardBtn"),
    hamburgerButton: document.getElementById("hamburgerButton"),
    mobileMenu: document.getElementById("mobileMenu"),
    exitButton: document.getElementById("exitButton"),
    workoutDaysElement: document.getElementById("workout-days"),
    workoutBarChartCanvas: document.getElementById("workoutBarChartCanvas"),
    sleepChartCanvas: document.getElementById("sleepChartCanvas"),
    loginButton: document.getElementById("loginButton"),
    clickHome: document.getElementById("clickHome"),
  };

  

 

  const sections = {
    dashboard: document.getElementById('dashboard-section'),
    stats: document.getElementById('stats-section'),
  };
  
  function showSection(section) {
    // Save current section to localStorage
    Object.keys(sections).forEach((key) => {
      if (key === section) {
        sections[key].classList.remove('hidden'); // Show the active section
        if (key === 'dashboard') {
          initializeCharts();
        }
      } else {
        sections[key].classList.add('hidden'); // Hide other sections
      }
    });
  }
  
  // Event listeners for navigation
document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent page reload
    const page = e.target.id; // Get the page id
    if (page && sections[page]) {
      history.pushState({ page }, '', `/?page=${page}`);
      showSection(page);
    }
  });
});
  
// Handle browser back/forward navigation
window.onpopstate = (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'dashboard';
  showSection(page);
};
  
 // Initialize the app
const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get('page') || 'dashboard';
history.replaceState({ page: currentPage }, '', `/?page=${currentPage}`);
showSection(currentPage);
 


function handleSleepDataSubmit(event) {
  event.preventDefault();


// Get the input values
const startDate = new Date(document.querySelector('[name="sleep-start-date"]').value);
const startTime = document.querySelector('[name="sleep-start-time"]').value;
const endDate = new Date(document.querySelector('[name="sleep-end-date"]').value);
const endTime = document.querySelector('[name="sleep-end-time"]').value;

// Combine date and time
const start = new Date(`${startDate.toDateString()} ${startTime}`);
const end = new Date(`${endDate.toDateString()} ${endTime}`);

// Calculate hours slept
const hoursSlept = (end - start) / (1000 * 60 * 60);

// Update sleep data
sleepData.actual = hoursSlept;

// Update both charts
updateSleepCharts();

}


//  initializeCharts function to use sleepData
function initializeCharts() {
  // ... your existing workoutChart code ...

  if (elements.sleepChartCanvas) {
    const sleepCtx = elements.sleepChartCanvas.getContext("2d");
    sleepChart = new Chart(sleepCtx, {
      type: "bar",
      data: {
        labels: ["Actual", "Goal"],
        datasets: [{ 
          label: "Sleep Time", 
          data: [sleepData.actual, sleepData.goal], 
          backgroundColor: ["#78e3fd", "rgba(255,206,86,0.2)"] 
        }],
      },
      options: { 
        scales: { y: { beginAtZero: true } }, 
        plugins: { legend: { display: false } } 
      },
    });
  }
}

// Function to sign in with Discord
async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: 'https://app-bo6g.vercel.app/'
    }
  });

  if (error) {
    console.error('Error signing in with Discord:', error);
  } else {
    console.log('Successfully signed in with Discord:', data);
  }
}


supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session);

    //Store user session data in local
    if(session) {
      localStorage.setItem('user', JSON.stringify(session.user));
      localStorage.setItem('access_token', session.access_token);
    }

    //Show logoutbutton and hide loginbutton
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';

    //Logout functionality
    logoutButton.onlick = async () => {
      await supabase.auth.signOut();
    };

    console.log('Stored user in localStorage: ', session.user);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');

    // Show login button and hide logout button
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';

    //Login functionality
    loginButton.onlick = () => {
      signInWithDiscord();
    };
   }
});


const initializeAuthButtons = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    // User is already signed in
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';

    logoutButton.onclick = async () => {
      await supabase.auth.signOut();
    };
  } else {
    // User is not signed in
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';

    loginButton.onclick = () => {
      signInWithDiscord();
    };
  }
};



  // call initialization function on page load
  initializeAuthButtons();




    //ClickHome
    document.getElementById('clickHome').addEventListener('click', () => {
      history.pushState({page: 'dashboard '}, '', '/');
      showSection('dashboard');
    })


    function showMenu() {
      mobileMenu.classList.remove('hidden', 'translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      document.addEventListener('click', closeMenuOnOutsideClick);
    }
  
    function hideMenu() {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('hidden', 'translate-x-full');
      document.removeEventListener('click', closeMenuOnOutsideClick);
    }
  
    function closeMenuOnOutsideClick(event) {
      if (!mobileMenu.contains(event.target) && !hamburgerButton.contains(event.target)) {
        hideMenu();
      }
    }
  
    hamburgerButton.addEventListener('click', showMenu);
    exitButton.addEventListener('click', hideMenu);
  });

