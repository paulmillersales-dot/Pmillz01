const threatLevels = [
  {
    level: "NORMAL",
    icon: "🟢",
    description: "No significant anomalies detected."
  },
  {
    level: "ELEVATED",
    icon: "🟡",
    description: "Unusual activity reported."
  },
  {
    level: "HIGH",
    icon: "🟠",
    description: "Containment teams are on standby."
  },
  {
    level: "CONTAINMENT FAILURE",
    icon: "🔴",
    description: "Multiple active incidents detected."
  },
  {
    level: "QUACKTASTROPHE",
    icon: "🦆",
    description: "Department of Anomalous Quacktivity intervention required."
  }
];

const today = new Date();
const index = today.getDate() % threatLevels.length;
const threat = threatLevels[index];

const container = document.getElementById("threat-level");

if (container) {
  container.innerHTML = `
    <strong>${threat.icon} THREAT LEVEL: ${threat.level}</strong><br>
    <small>${threat.description}</small>
  `;
}
