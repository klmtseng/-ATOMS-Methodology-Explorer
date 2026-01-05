# ATOMS: Nonstationarity-Complexity Tradeoff Explorer

This is an interactive React application designed to replicate and visualize the methodologies presented in the paper **"The nonstationarity-complexity tradeoff in return prediction"** (Capponi et al., 2025).

The dashboard serves as an educational tool for quantitative researchers and financial engineers to understand how the **Adaptive Tournament Model Selection (ATOMS)** algorithm dynamically balances model complexity with the length of the training window in non-stationary financial environments.

## Features

### 1. Tradeoff Explorer (Theorem 3.1)
An interactive simulation of the core theoretical finding of the paper.
- **Visualize the Tradeoff:** See how the Total Prediction Error is composed of Bias (Misspecification), Variance, and Non-stationarity drift.
- **Interactive Controls:** Adjust the "Environmental Drift" parameter to observe how the optimal window size ($k^*$) shrinks as markets become more volatile.
- **Model Comparison:** Observe the crossover point where simple models (High Bias/Low Variance) outperform complex models (Low Bias/High Variance) in highly non-stationary regimes.

### 2. ATOMS Algorithm Simulation
A visual walkthrough of the two-step selection process:
- **Algorithm 1 (Tournament):** Visualizes the pivot-based pairwise competition between candidate models.
- **Algorithm 2 (Adaptive Comparison):** Demonstrates how models are compared not on fixed validation sets, but on adaptive windows that minimize estimation error for the specific comparison at hand.

### 3. Empirical Results
Interactive charts replicating the key figures from the paper using the 17-Industry Portfolio dataset:
- **Cumulative Wealth:** Comparison of the ATOMS strategy against fixed-window benchmarks (Linear-32mo, Linear-512mo).
- **Recession Performance:** Bar charts highlighting the algorithm's superior Out-of-Sample $R^2$ during key crisis periods (Gulf War, Dot-Com Bubble, 2008 Financial Crisis).

## Technologies Used

- **Frontend:** React, TypeScript
- **Visualization:** Recharts
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/atoms-tradeoff-explorer.git
   ```

2. Install dependencies:
   ```bash
   cd atoms-tradeoff-explorer
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Citation

If you use this visualization for research or education, please cite the original paper:

> Capponi, A., et al. (2025). *The nonstationarity-complexity tradeoff in return prediction*.

## License

MIT License
