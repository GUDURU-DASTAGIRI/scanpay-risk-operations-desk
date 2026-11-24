# ScanPay Payout Risk Desk

Built by **Dastagiri Guduru**  
Live Application: **[Launch Risk Desk Console](https://scanpay-risk-desk.loca.lt)**  
Repository: **[github.com/GUDURU-DASTAGIRI/scanpay-risk-operations-desk](https://github.com/GUDURU-DASTAGIRI/scanpay-risk-operations-desk)**

---

## What is This?

When field-service businesses (plumbers, HVAC techs, locksmiths) collect card and ACH payments through ScanPay, we hold the funds and pay them out on a **T+2 weekday schedule**. 

Once money leaves our bank account, a fraudulent payout is virtually unrecoverable. 

This workspace is a **real-time risk operations console** designed for the ops team sitting down on **Friday, 13 November 2026 at 10:00 AM IST** to screen **20 pending payouts ($85.5K)** covering collections from Tuesday, 10 November.

---

## Tech Stack & Architecture (Why I Built It This Way)

Most candidates reach for **Streamlit** for tasks like this. Here is why I deliberately didn't:

* **Streamlit's Pitfalls in Production**: Streamlit re-executes the entire Python script from top to bottom on every click, has noticeable render latency, and free hosting tiers sleep after minutes of inactivity—taking 45–60 seconds to cold boot (or failing during a live screen share).
* **Why React 19 + TypeScript + Vite**:
  * **Sub-100ms Instant Boot**: 100% client-side deterministic evaluation. Zero cold starts, zero backend WebSocket timeouts.
  * **60 FPS Snappy UX**: Filtering across transactions, switching views, and toggling overrides happen instantly without page reload lag.
  * **Fintech-Grade Workspace**: A split-screen layout (queue on the left, deep entity dossier on the right) inspired by platforms like Stripe Radar and Mercury.
* **Why Tailwind CSS & Lucide**: High-density UI with clear visual semantics—analysts immediately distinguish between auto-approvals, manual reviews, and fraud rejects.
* **Companion Python Engine (`engine.py`)**: For engineers who want to test the raw logic headlessly, a clean standalone Python script is included to re-evaluate the CSVs and generate `decisions.csv` via CLI.

---

## How It Works

The platform operates on ScanPay's three core principles:

1. **Reject ONLY for Fraud Exposure**: We never block a payout just because volume or ticket sizes look high. Odd volume goes to **Manual Review** for human verification. A payout is only **Rejected** when directly linked to confirmed fraud patterns seen in our historical data.
2. **Actionable Plain English + Proof IDs**: Every manual review and rejection gives the analyst a clear explanation and the specific IDs (transactions, teams, hardware device fingerprints, or routing numbers) that prove it.
3. **Audited Human Overrides**: Operators can change any decision on the fly. An override requires a reason and is saved to an immutable in-memory audit log—because today's decisions become tomorrow's training history.

---

## Core Features in the Console

* **Interactive Risk Queue**: Filter across Approvals, Manual Reviews, Rejections, and Overridden payouts with live search and anomaly badges.
* **Deep Entity Dossier**: Inspect merchant device fingerprints, payout bank accounts, and transaction ledgers side-by-side with trade averages.
* **Fraud Syndicate Intelligence**: Visual breakdown of the 3 historical fraud clusters (Card Ring, Foreign Card Testing, Account Takeover) showing how today's bad actors match past incidents.
* **Baseline Monitoring**: Dynamic charts comparing today's approved, reviewed, and blocked dollars against the 20-day historical daily average.
* **1-Click Export**: Download the official `decisions.csv` strictly formatted to ScanPay's specifications.

---

## Running Locally

If you'd like to run it on your own machine:

```bash
# 1. Clone the repo
git clone https://github.com/GUDURU-DASTAGIRI/scanpay-risk-operations-desk.git
cd scanpay-risk-operations-desk

# 2. Install dependencies & run
npm install
npm run preview
```
Visit **http://localhost:4173** in your browser.

To run the standalone Python decision engine:
```bash
python engine.py
```
This generates and validates `decisions.csv` directly from the raw datasets.

---

## Deliverables Included

* **`decisions.csv`**: The 20-row hand-in file matching all 6 required columns.
* **`engine.py`**: Standalone Python rules engine.
* **`payouts_data.json`**: Bundled dataset powering the interactive UI.
* **Full Source Code**: Clean, modular React + TypeScript codebase.
