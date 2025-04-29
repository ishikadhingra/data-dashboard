import { Customer } from '../types/customer';

/**
 * Converts a loan repayment history array to a string rating
 */
function mapHistoryToString(history: 'Poor' | 'Fair' | 'Good' | 'Excellent' | number[]): 'Poor' | 'Fair' | 'Good' | 'Excellent' {
  if (Array.isArray(history)) {
    const paid = history.filter(x => x === 1).length;
    const ratio = paid / history.length;
    if (ratio >= 0.95) return 'Excellent';
    if (ratio >= 0.8) return 'Good';
    if (ratio >= 0.5) return 'Fair';
    return 'Poor';
  }
  return history;
}

/**
 * Calculates a risk score for a customer based on various factors
 * @param creditScore - Customer's credit score (300-850)
 * @param loanRepaymentHistory - Customer's loan repayment history (string or number[])
 * @param monthlyIncome - Customer's monthly income
 * @param outstandingLoans - Customer's outstanding loans
 * @returns Risk score from 0-100 (higher is more risky)
 */
export const calculateRiskScore = (
  creditScore: number,
  loanRepaymentHistory: 'Poor' | 'Fair' | 'Good' | 'Excellent' | number[],
  monthlyIncome: number,
  outstandingLoans: number
): number => {
  let score = 50; // Start with a neutral score
  
  // Credit score impact (higher credit score = lower risk)
  if (creditScore >= 800) {
    score -= 20;
  } else if (creditScore >= 700) {
    score -= 10;
  } else if (creditScore >= 600) {
    // No change
  } else if (creditScore >= 500) {
    score += 10;
  } else {
    score += 20;
  }
  
  // Loan repayment history impact
  const historyString = mapHistoryToString(loanRepaymentHistory);
  switch (historyString) {
    case 'Excellent':
      score -= 15;
      break;
    case 'Good':
      score -= 5;
      break;
    case 'Fair':
      score += 5;
      break;
    case 'Poor':
      score += 15;
      break;
    default:
      // No change
      break;
  }
  
  // Debt-to-income ratio impact
  const dtiRatio = outstandingLoans / (monthlyIncome * 12);
  if (dtiRatio <= 0.2) {
    score -= 10;
  } else if (dtiRatio <= 0.4) {
    // No change
  } else if (dtiRatio <= 0.6) {
    score += 10;
  } else {
    score += 20;
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculates risk score for a customer object
 * @param customer - Customer object
 * @returns Risk score from 0-100 (higher is more risky)
 */
export const calculateCustomerRiskScore = (customer: Customer): number => {
  return calculateRiskScore(
    customer.creditScore,
    customer.loanRepaymentHistory,
    customer.monthlyIncome,
    customer.outstandingLoans
  );
};

export default {
  calculateRiskScore,
  calculateCustomerRiskScore
}; 