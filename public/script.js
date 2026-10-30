const discoverBtn = document.getElementById("discoverBtn");
const opportunitiesSection = document.getElementById("opportunitiesSection");

if (discoverBtn) {
  discoverBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const startupName = document.getElementById("startupName")?.value.trim();
    const sector = document.getElementById("sector")?.value;
    const stage = document.getElementById("stage")?.value;
    const location = document.getElementById("location")?.value.trim();

    if (!sector || !stage || !location) {
      alert("Please fill in all startup details.");
      return;
    }

    discoverBtn.disabled = true;
    discoverBtn.textContent = "Finding Matches...";

    try {
      const response = await fetch("/api/opportunities/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          startupName,
          sector,
          stage,
          location
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to find matches.");
      }

      displayOpportunities(data.matches || []);

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      discoverBtn.disabled = false;
      discoverBtn.textContent = "Find Matches";
    }
  });
}

function displayOpportunities(opportunities) {
  if (!opportunitiesSection) return;

  opportunitiesSection.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = `Your Matching Opportunities (${opportunities.length})`;
  opportunitiesSection.appendChild(heading);

  if (opportunities.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No matching opportunities found.";
    opportunitiesSection.appendChild(message);
    return;
  }

  opportunities.forEach((opportunity) => {
    const card = document.createElement("div");
    card.className = "opportunity-card";

    const title = document.createElement("h3");
    title.textContent = opportunity.name || opportunity.title || "Untitled Opportunity";

    const category = document.createElement("p");
    category.textContent = opportunity.type || opportunity.category || "Opportunity";

    const description = document.createElement("p");
    description.textContent = opportunity.description || "No description available.";

    const organization = document.createElement("p");
    organization.textContent = `Organisation: ${opportunity.organization || "Not specified"}`;

    const deadline = document.createElement("p");
    deadline.textContent = `Deadline: ${opportunity.deadline || "Not specified"}`;

    const score = document.createElement("p");
    score.textContent = `Match Score: ${opportunity.matchScore ?? 0}%`;

    const link = document.createElement("a");
    link.textContent = "View Official Opportunity";
    link.href = opportunity.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.append(title, category, description, organization, deadline, score, link);
    opportunitiesSection.appendChild(card);
  });
}