import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ynaebzwplirfhvoxrvnz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA');



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
  };

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

    
   
    // Charts
    if (elements.workoutBarChartCanvas) {
      const ctx = elements.workoutBarChartCanvas.getContext("2d");
      new Chart(ctx, {
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
      new Chart(sleepCtx, {
        type: "bar",
        data: {
          labels: ["Actual", "Goal"],
          datasets: [{ label: "Sleep Time", data: [6, 8], backgroundColor: ["#78e3fd", "rgba(255,206,86,0.2)"] }],
        },
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } },
      });
    }


    //Show mobile menu
    const showMenu = () => {
      mobileMenu.classList.remove('hidden', 'translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      document.addEventListener("click", closeMenuOnOutsideClick);
    };

    //Hide mobile menu
    const hideMenu = () => {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('hidden', 'translate-x-full');
      document.removeEventListener("click", closeMenuOnOutsideClick);
    }

    //Open Menu
    hamburgerButton.addEventListener('click', showMenu);

    //Close Menu
    exitButton.addEventListener('click', hideMenu);

    //Close Menu if outside click
    function closeMenuOnOutsideClick(event) {
      if (!mobileMenu.contains(event.target) && !hamburgerButton.contains(event.target)) {
        hideMenu();
      }
    }

  });
