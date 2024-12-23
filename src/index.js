import { Chart, registerables } from "chart.js";
Chart.register(...registerables);


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
