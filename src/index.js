import { Chart, registerables } from "chart.js";
import { createClient } from '@supabase/supabase-js';
Chart.register(...registerables);

// Replace these with your Supabase URL and anon key from your project settings
const supabaseUrl = 'https://ynaebzwplirfhvoxrvnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA';

// Function to sign in with Discord
async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirecTo: ''
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
    // Here you can update UI or fetch user details
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

document.getElementById('loginWithDiscord').addEventListener('click', signInWithDiscord),



  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded event fired.");

    // Element selections
    const elements = {
      scrollContainer: document.getElementById("scrollContainer"),
      addCardBtn: document.getElementById("addCardBtn"),
      hamburgerButton: document.getElementById("hamburgerButton"),
      mobileMenu: document.getElementById("mobileMenu"),
      exitButton: document.getElementById("exit"),
      scrollLeftBtn: document.getElementById("scrollLeftBtn"),
      scrollRightBtn: document.getElementById("scrollRightBtn"),
      workoutDaysElement: document.getElementById("workout-days"),
      workoutBarChartCanvas: document.getElementById("workoutBarChartCanvas"),
      sleepChartCanvas: document.getElementById("sleepChartCanvas"),
      loginButton: document.getElementById("loginButton"),
      loginPopup: document.getElementById("loginPopup"),
      closePopup: document.getElementById("closePopup"), 
    };

    


    // Popup handling
    elements.loginButton?.addEventListener("click", () => {
      elements.loginPopup?.classList.remove("hidden");
    });

    elements.closePopup?.addEventListener("click", () => {
      elements.loginPopup?.classList.add("hidden");
    });

    // Charts
    if (elements.workoutBarChartCanvas) {
      const ctx = elements.workoutBarChartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Calories Intake", "Calories Burned", "Activity Time"],
          datasets: [
            { label: "Workout Metrics", data: [800, 850, 400], backgroundColor: ["#23262C", "#9E2835", "#000000"] },
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
          datasets: [{ label: "Sleep Time", data: [6, 8], backgroundColor: ["rgba(54,162,235,0.2)", "rgba(255,206,86,0.2)"] }],
        },
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } },
      });
    }
  });
