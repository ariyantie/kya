const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  // Basic Loan Information
  loanNumber: {
    type: String,
    unique: true,
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Borrower is required']
  },
  
  // Loan Details
  loanDetails: {
    requestedAmount: {
      type: Number,
      required: [true, 'Requested amount is required'],
      min: [500000, 'Minimum loan amount is Rp 500,000']
    },
    approvedAmount: {
      type: Number,
      min: 0
    },
    disbursedAmount: {
      type: Number,
      min: 0
    },
    purpose: {
      type: String,
      required: [true, 'Loan purpose is required'],
      enum: [
        'personal', 'business', 'education', 'medical', 'home_improvement',
        'debt_consolidation', 'emergency', 'vehicle', 'wedding', 'vacation', 'other'
      ]
    },
    purposeDescription: String,
    currency: {
      type: String,
      default: 'IDR'
    }
  },

  // Interest and Terms
  terms: {
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [0, 'Interest rate cannot be negative'],
      max: [100, 'Interest rate cannot exceed 100%']
    },
    processingFee: {
      type: Number,
      default: 0,
      min: 0
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0
    },
    insuranceFee: {
      type: Number,
      default: 0,
      min: 0
    },
    tenure: {
      type: Number,
      required: [true, 'Loan tenure is required'],
      min: [1, 'Minimum tenure is 1 month'],
      max: [60, 'Maximum tenure is 60 months']
    },
    tenureUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'months'
    },
    installmentType: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly'],
      default: 'monthly'
    },
    installmentAmount: {
      type: Number,
      min: 0
    },
    totalRepaymentAmount: Number,
    gracePeriodDays: {
      type: Number,
      default: 3,
      min: 0
    }
  },

  // Status and Workflow
  status: {
    type: String,
    enum: [
      'draft', 'submitted', 'under_review', 'document_verification',
      'credit_assessment', 'approved', 'rejected', 'disbursed',
      'active', 'completed', 'defaulted', 'written_off', 'cancelled'
    ],
    default: 'draft'
  },
  
  substatus: {
    type: String,
    enum: [
      'pending_documents', 'pending_verification', 'pending_approval',
      'pending_disbursement', 'current', 'overdue', 'restructured'
    ]
  },

  // Important Dates
  dates: {
    applicationDate: {
      type: Date,
      default: Date.now
    },
    approvalDate: Date,
    rejectionDate: Date,
    disbursementDate: Date,
    firstInstallmentDate: Date,
    lastInstallmentDate: Date,
    completionDate: Date,
    defaultDate: Date,
    nextDueDate: Date
  },

  // Application Documents
  documents: {
    applicationForm: String,
    incomeProof: [String],
    bankStatements: [String],
    identityDocuments: [String],
    collateralDocuments: [String],
    guarantorDocuments: [String],
    otherDocuments: [{
      type: String,
      description: String,
      uploadDate: { type: Date, default: Date.now }
    }]
  },

  // Risk Assessment
  riskAssessment: {
    creditScore: Number,
    riskGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E'],
      default: 'C'
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    probabilityOfDefault: Number,
    lossGivenDefault: Number,
    expectedLoss: Number,
    riskFactors: [{
      factor: String,
      impact: { type: String, enum: ['positive', 'negative', 'neutral'] },
      weight: Number,
      description: String
    }]
  },

  // Approval Workflow
  approvalWorkflow: {
    currentStep: {
      type: String,
      enum: ['initial_review', 'document_check', 'credit_check', 'manager_approval', 'final_approval'],
      default: 'initial_review'
    },
    approvals: [{
      step: String,
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvalDate: { type: Date, default: Date.now },
      decision: { type: String, enum: ['approved', 'rejected', 'pending'] },
      comments: String,
      conditions: [String]
    }],
    rejectionReason: String,
    rejectionCategory: {
      type: String,
      enum: [
        'insufficient_income', 'poor_credit_history', 'incomplete_documents',
        'policy_violation', 'high_risk', 'duplicate_application', 'other'
      ]
    }
  },

  // Collateral and Guarantor
  collateral: [{
    type: {
      type: String,
      enum: ['vehicle', 'property', 'gold', 'savings', 'securities', 'other']
    },
    description: String,
    estimatedValue: Number,
    documents: [String],
    verified: { type: Boolean, default: false },
    verificationDate: Date
  }],

  guarantor: {
    isRequired: { type: Boolean, default: false },
    details: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
      address: String,
      occupation: String,
      monthlyIncome: Number,
      identityDocument: String,
      incomeProof: String,
      agreementSigned: { type: Boolean, default: false },
      agreementDate: Date
    }
  },

  // Disbursement Details
  disbursement: {
    method: {
      type: String,
      enum: ['bank_transfer', 'cash', 'check', 'mobile_wallet'],
      default: 'bank_transfer'
    },
    bankDetails: {
      accountNumber: String,
      accountName: String,
      bankName: String,
      branchCode: String
    },
    walletDetails: {
      provider: String,
      accountNumber: String
    },
    transactionId: String,
    disbursementFee: { type: Number, default: 0 },
    actualDisbursedAmount: Number,
    disbursementDate: Date,
    disbursedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Repayment Schedule
  repaymentSchedule: [{
    installmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    principalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    interestAmount: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partially_paid'],
      default: 'pending'
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    paidDate: Date,
    lateFeeAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    penaltyAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    remainingAmount: Number
  }],

  // Payment Summary
  paymentSummary: {
    totalPaid: { type: Number, default: 0 },
    principalPaid: { type: Number, default: 0 },
    interestPaid: { type: Number, default: 0 },
    feesPaid: { type: Number, default: 0 },
    penaltiesPaid: { type: Number, default: 0 },
    remainingPrincipal: Number,
    remainingInterest: Number,
    totalRemaining: Number,
    overdueAmount: { type: Number, default: 0 },
    daysOverdue: { type: Number, default: 0 },
    nextPaymentDue: Date,
    nextPaymentAmount: Number
  },

  // Communication and Notes
  communications: [{
    type: { type: String, enum: ['call', 'sms', 'email', 'visit', 'letter'] },
    direction: { type: String, enum: ['inbound', 'outbound'] },
    date: { type: Date, default: Date.now },
    subject: String,
    content: String,
    outcome: String,
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  notes: [{
    type: { type: String, enum: ['application', 'approval', 'disbursement', 'payment', 'collection', 'general'] },
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: { type: Date, default: Date.now },
    isImportant: { type: Boolean, default: false },
    visibility: { type: String, enum: ['internal', 'customer'], default: 'internal' }
  }],

  // Collection and Recovery
  collection: {
    isInCollection: { type: Boolean, default: false },
    collectionStartDate: Date,
    collectionStage: {
      type: String,
      enum: ['soft', 'medium', 'hard', 'legal'],
      default: 'soft'
    },
    assignedCollector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    collectionActions: [{
      action: String,
      date: { type: Date, default: Date.now },
      result: String,
      nextAction: String,
      actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    recoveryAmount: { type: Number, default: 0 },
    writeOffAmount: { type: Number, default: 0 },
    writeOffDate: Date,
    writeOffReason: String
  },

  // Restructuring
  restructuring: {
    isRestructured: { type: Boolean, default: false },
    restructureHistory: [{
      date: { type: Date, default: Date.now },
      reason: String,
      oldTerms: {
        tenure: Number,
        interestRate: Number,
        installmentAmount: Number
      },
      newTerms: {
        tenure: Number,
        interestRate: Number,
        installmentAmount: Number
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },

  // Insurance
  insurance: {
    isInsured: { type: Boolean, default: false },
    provider: String,
    policyNumber: String,
    coverage: {
      death: { type: Boolean, default: false },
      disability: { type: Boolean, default: false },
      jobLoss: { type: Boolean, default: false }
    },
    premiumAmount: Number,
    startDate: Date,
    endDate: Date
  },

  // Performance Metrics
  performance: {
    onTimePayments: { type: Number, default: 0 },
    latePayments: { type: Number, default: 0 },
    missedPayments: { type: Number, default: 0 },
    paymentHistoryScore: { type: Number, default: 100 },
    behaviorScore: { type: Number, default: 50 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
loanSchema.index({ loanNumber: 1 });
loanSchema.index({ borrower: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ 'dates.applicationDate': -1 });
loanSchema.index({ 'dates.nextDueDate': 1 });
loanSchema.index({ 'paymentSummary.overdueAmount': -1 });

// Virtual for loan age in days
loanSchema.virtual('loanAge').get(function() {
  if (!this.dates.disbursementDate) return 0;
  return Math.floor((Date.now() - this.dates.disbursementDate) / (1000 * 60 * 60 * 24));
});

// Virtual for total loan amount with fees
loanSchema.virtual('totalLoanCost').get(function() {
  return (this.loanDetails.approvedAmount || 0) + 
         (this.terms.processingFee || 0) + 
         (this.terms.insuranceFee || 0);
});

// Pre-save middleware to generate loan number
loanSchema.pre('save', function(next) {
  if (!this.loanNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.loanNumber = `MK${year}${month}${random}`;
  }
  next();
});

// Pre-save middleware to calculate repayment schedule
loanSchema.pre('save', function(next) {
  if (this.isModified('loanDetails.approvedAmount') || 
      this.isModified('terms.interestRate') || 
      this.isModified('terms.tenure')) {
    this.generateRepaymentSchedule();
  }
  next();
});

// Instance methods
loanSchema.methods.generateRepaymentSchedule = function() {
  if (!this.loanDetails.approvedAmount || !this.terms.interestRate || !this.terms.tenure) {
    return;
  }

  const principal = this.loanDetails.approvedAmount;
  const monthlyRate = this.terms.interestRate / 100 / 12;
  const numberOfPayments = this.terms.tenure;
  
  // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  this.terms.installmentAmount = Math.round(emi);
  this.terms.totalRepaymentAmount = Math.round(emi * numberOfPayments);
  
  // Generate schedule
  this.repaymentSchedule = [];
  let remainingPrincipal = principal;
  let currentDate = new Date();
  
  if (this.dates.disbursementDate) {
    currentDate = new Date(this.dates.disbursementDate);
  }
  
  for (let i = 1; i <= numberOfPayments; i++) {
    const interestAmount = Math.round(remainingPrincipal * monthlyRate);
    const principalAmount = Math.round(emi - interestAmount);
    
    // Adjust last payment to account for rounding
    if (i === numberOfPayments) {
      principalAmount = remainingPrincipal;
      totalAmount = principalAmount + interestAmount;
    } else {
      totalAmount = Math.round(emi);
    }
    
    currentDate.setMonth(currentDate.getMonth() + 1);
    
    this.repaymentSchedule.push({
      installmentNumber: i,
      dueDate: new Date(currentDate),
      principalAmount: principalAmount,
      interestAmount: interestAmount,
      totalAmount: totalAmount,
      status: 'pending'
    });
    
    remainingPrincipal -= principalAmount;
  }
  
  // Set first and last installment dates
  if (this.repaymentSchedule.length > 0) {
    this.dates.firstInstallmentDate = this.repaymentSchedule[0].dueDate;
    this.dates.lastInstallmentDate = this.repaymentSchedule[this.repaymentSchedule.length - 1].dueDate;
    this.dates.nextDueDate = this.repaymentSchedule.find(r => r.status === 'pending')?.dueDate;
  }
};

loanSchema.methods.updatePaymentSummary = function() {
  const paidInstallments = this.repaymentSchedule.filter(r => r.status === 'paid');
  
  this.paymentSummary.totalPaid = paidInstallments.reduce((sum, r) => sum + r.paidAmount, 0);
  this.paymentSummary.principalPaid = paidInstallments.reduce((sum, r) => sum + r.principalAmount, 0);
  this.paymentSummary.interestPaid = paidInstallments.reduce((sum, r) => sum + r.interestAmount, 0);
  
  this.paymentSummary.remainingPrincipal = this.loanDetails.approvedAmount - this.paymentSummary.principalPaid;
  this.paymentSummary.totalRemaining = this.terms.totalRepaymentAmount - this.paymentSummary.totalPaid;
  
  // Calculate overdue amount
  const today = new Date();
  const overdueInstallments = this.repaymentSchedule.filter(r => 
    r.status === 'overdue' || (r.status === 'pending' && r.dueDate < today)
  );
  
  this.paymentSummary.overdueAmount = overdueInstallments.reduce((sum, r) => sum + (r.totalAmount - r.paidAmount), 0);
  
  if (overdueInstallments.length > 0) {
    const oldestOverdue = overdueInstallments.sort((a, b) => a.dueDate - b.dueDate)[0];
    this.paymentSummary.daysOverdue = Math.floor((today - oldestOverdue.dueDate) / (1000 * 60 * 60 * 24));
  }
  
  // Set next payment details
  const nextPending = this.repaymentSchedule.find(r => r.status === 'pending');
  if (nextPending) {
    this.paymentSummary.nextPaymentDue = nextPending.dueDate;
    this.paymentSummary.nextPaymentAmount = nextPending.totalAmount;
    this.dates.nextDueDate = nextPending.dueDate;
  }
};

loanSchema.methods.makePayment = function(amount, paymentDate = new Date()) {
  let remainingAmount = amount;
  const updatedInstallments = [];
  
  // Sort installments by due date
  const sortedInstallments = this.repaymentSchedule.sort((a, b) => a.dueDate - b.dueDate);
  
  for (let installment of sortedInstallments) {
    if (remainingAmount <= 0 || installment.status === 'paid') continue;
    
    const amountDue = installment.totalAmount - (installment.paidAmount || 0);
    const paymentForThisInstallment = Math.min(remainingAmount, amountDue);
    
    installment.paidAmount = (installment.paidAmount || 0) + paymentForThisInstallment;
    
    if (installment.paidAmount >= installment.totalAmount) {
      installment.status = 'paid';
      installment.paidDate = paymentDate;
    } else {
      installment.status = 'partially_paid';
    }
    
    remainingAmount -= paymentForThisInstallment;
    updatedInstallments.push(installment);
  }
  
  this.updatePaymentSummary();
  return updatedInstallments;
};

loanSchema.methods.calculateEarlyPaymentAmount = function() {
  const pendingInstallments = this.repaymentSchedule.filter(r => r.status === 'pending' || r.status === 'partially_paid');
  return pendingInstallments.reduce((sum, r) => sum + (r.totalAmount - (r.paidAmount || 0)), 0);
};

// Static methods
loanSchema.statics.findByLoanNumber = function(loanNumber) {
  return this.findOne({ loanNumber: loanNumber });
};

loanSchema.statics.findOverdueLoans = function() {
  const today = new Date();
  return this.find({
    status: 'active',
    'paymentSummary.overdueAmount': { $gt: 0 }
  });
};

loanSchema.statics.findLoansDueToday = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    status: 'active',
    'dates.nextDueDate': {
      $gte: today,
      $lt: tomorrow
    }
  });
};

module.exports = mongoose.model('Loan', loanSchema);