const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Payment Identification
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  externalTransactionId: String, // From payment gateway
  
  // Related Documents
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: [true, 'Loan reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'IDR'
  },
  
  // Payment Breakdown
  breakdown: {
    principalAmount: { type: Number, default: 0 },
    interestAmount: { type: Number, default: 0 },
    lateFeeAmount: { type: Number, default: 0 },
    penaltyAmount: { type: Number, default: 0 },
    processingFeeAmount: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 }
  },
  
  // Payment Method
  paymentMethod: {
    type: {
      type: String,
      enum: ['bank_transfer', 'credit_card', 'debit_card', 'mobile_wallet', 'cash', 'virtual_account', 'qris'],
      required: true
    },
    details: {
      // Bank Transfer
      bankName: String,
      accountNumber: String,
      accountName: String,
      
      // Card Payment
      cardType: { type: String, enum: ['visa', 'mastercard', 'amex', 'jcb'] },
      cardLast4: String,
      cardBrand: String,
      
      // Mobile Wallet
      walletProvider: { type: String, enum: ['gopay', 'ovo', 'dana', 'linkaja', 'shopeepay'] },
      walletNumber: String,
      
      // Virtual Account
      vaNumber: String,
      bankCode: String,
      
      // Cash
      receivedBy: String,
      receiptNumber: String,
      
      // QRIS
      qrisId: String,
      merchantId: String
    }
  },
  
  // Payment Gateway Information
  gateway: {
    provider: {
      type: String,
      enum: ['stripe', 'midtrans', 'xendit', 'doku', 'faspay', 'manual'],
      required: true
    },
    gatewayTransactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    gatewayFee: { type: Number, default: 0 },
    merchantId: String,
    terminalId: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  
  // Status History
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial_refund']
    },
    timestamp: { type: Date, default: Date.now },
    reason: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Payment Dates
  dates: {
    initiatedAt: { type: Date, default: Date.now },
    processedAt: Date,
    completedAt: Date,
    failedAt: Date,
    refundedAt: Date,
    dueDate: Date,
    scheduledDate: Date
  },
  
  // Payment Type
  paymentType: {
    type: String,
    enum: ['regular_payment', 'partial_payment', 'early_payment', 'overdue_payment', 'penalty_payment', 'settlement'],
    default: 'regular_payment'
  },
  
  // Installment Information
  installmentInfo: {
    installmentNumber: Number,
    totalInstallments: Number,
    isEarlyPayment: { type: Boolean, default: false },
    coveredInstallments: [Number] // Which installments this payment covers
  },
  
  // Fees and Charges
  fees: {
    processingFee: { type: Number, default: 0 },
    transactionFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    adminFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },
  
  // Refund Information
  refund: {
    isRefunded: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0 },
    refundReason: String,
    refundDate: Date,
    refundTransactionId: String,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Receipt and Documentation
  receipt: {
    receiptNumber: String,
    receiptUrl: String,
    invoiceNumber: String,
    invoiceUrl: String,
    generated: { type: Boolean, default: false },
    sentToCustomer: { type: Boolean, default: false }
  },
  
  // Customer Information
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  
  // IP and Device Information
  deviceInfo: {
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    platform: String,
    appVersion: String
  },
  
  // Risk and Fraud Detection
  riskData: {
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    fraudScore: { type: Number, min: 0, max: 100, default: 0 },
    riskFactors: [String],
    isHighRisk: { type: Boolean, default: false },
    reviewRequired: { type: Boolean, default: false },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    reviewNotes: String
  },
  
  // Notifications
  notifications: {
    customerNotified: { type: Boolean, default: false },
    adminNotified: { type: Boolean, default: false },
    smsNotification: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String
    },
    emailNotification: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String
    },
    pushNotification: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String
    }
  },
  
  // Reconciliation
  reconciliation: {
    isReconciled: { type: Boolean, default: false },
    reconciledAt: Date,
    reconciledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bankStatementReference: String,
    discrepancyAmount: { type: Number, default: 0 },
    discrepancyReason: String
  },
  
  // Metadata
  metadata: {
    channel: { type: String, enum: ['mobile_app', 'web', 'ussd', 'atm', 'bank_branch', 'agent'] },
    campaignId: String,
    promotionCode: String,
    referenceNumber: String,
    notes: String,
    tags: [String]
  },
  
  // Retry Information (for failed payments)
  retryInfo: {
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    nextRetryAt: Date,
    retryHistory: [{
      attemptNumber: Number,
      timestamp: { type: Date, default: Date.now },
      status: String,
      errorCode: String,
      errorMessage: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ loan: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'dates.initiatedAt': -1 });
paymentSchema.index({ 'dates.completedAt': -1 });
paymentSchema.index({ 'gateway.provider': 1 });
paymentSchema.index({ 'paymentMethod.type': 1 });
paymentSchema.index({ amount: -1 });

// Compound indexes
paymentSchema.index({ loan: 1, status: 1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1, 'dates.initiatedAt': -1 });

// Virtual for net amount (amount - fees)
paymentSchema.virtual('netAmount').get(function() {
  return this.amount - (this.fees.totalFees || 0);
});

// Virtual for payment age in hours
paymentSchema.virtual('paymentAge').get(function() {
  return Math.floor((Date.now() - this.dates.initiatedAt) / (1000 * 60 * 60));
});

// Pre-save middleware to generate payment ID
paymentSchema.pre('save', function(next) {
  if (!this.paymentId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.paymentId = `PAY${timestamp}${random}`.toUpperCase();
  }
  
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    this.transactionId = `TXN${timestamp}${random}`.toUpperCase();
  }
  
  next();
});

// Pre-save middleware to calculate total fees
paymentSchema.pre('save', function(next) {
  this.fees.totalFees = (this.fees.processingFee || 0) + 
                        (this.fees.transactionFee || 0) + 
                        (this.fees.serviceFee || 0) + 
                        (this.fees.adminFee || 0);
  next();
});

// Pre-save middleware to add status history
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      reason: this.statusChangeReason || 'Status updated'
    });
  }
  next();
});

// Instance methods
paymentSchema.methods.markAsCompleted = function(completedBy) {
  this.status = 'completed';
  this.dates.completedAt = new Date();
  this.statusHistory.push({
    status: 'completed',
    timestamp: new Date(),
    reason: 'Payment completed successfully',
    updatedBy: completedBy
  });
  return this.save();
};

paymentSchema.methods.markAsFailed = function(reason, failedBy) {
  this.status = 'failed';
  this.dates.failedAt = new Date();
  this.statusHistory.push({
    status: 'failed',
    timestamp: new Date(),
    reason: reason || 'Payment failed',
    updatedBy: failedBy
  });
  return this.save();
};

paymentSchema.methods.processRefund = function(refundAmount, reason, refundedBy) {
  this.refund.isRefunded = true;
  this.refund.refundAmount = refundAmount || this.amount;
  this.refund.refundReason = reason;
  this.refund.refundDate = new Date();
  this.refund.refundedBy = refundedBy;
  
  if (refundAmount >= this.amount) {
    this.status = 'refunded';
  } else {
    this.status = 'partial_refund';
  }
  
  this.statusHistory.push({
    status: this.status,
    timestamp: new Date(),
    reason: `Refund processed: ${reason}`,
    updatedBy: refundedBy
  });
  
  return this.save();
};

paymentSchema.methods.addRetryAttempt = function(status, errorCode, errorMessage) {
  this.retryInfo.retryCount += 1;
  this.retryInfo.retryHistory.push({
    attemptNumber: this.retryInfo.retryCount,
    timestamp: new Date(),
    status: status,
    errorCode: errorCode,
    errorMessage: errorMessage
  });
  
  // Set next retry time (exponential backoff)
  const backoffMinutes = Math.pow(2, this.retryInfo.retryCount) * 5; // 5, 10, 20, 40 minutes
  this.retryInfo.nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000);
  
  return this.save();
};

paymentSchema.methods.generateReceipt = function() {
  if (!this.receipt.receiptNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.receipt.receiptNumber = `RCP${date}${random}`;
  }
  
  this.receipt.generated = true;
  return this.save();
};

// Static methods
paymentSchema.statics.findByPaymentId = function(paymentId) {
  return this.findOne({ paymentId: paymentId });
};

paymentSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ transactionId: transactionId });
};

paymentSchema.statics.findPendingPayments = function() {
  return this.find({ status: 'pending' });
};

paymentSchema.statics.findFailedPayments = function() {
  return this.find({ status: 'failed' });
};

paymentSchema.statics.findPaymentsForReconciliation = function() {
  return this.find({ 
    status: 'completed',
    'reconciliation.isReconciled': false
  });
};

paymentSchema.statics.getPaymentStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'dates.completedAt': {
          $gte: startDate,
          $lte: endDate
        },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
        totalFees: { $sum: '$fees.totalFees' }
      }
    }
  ]);
};

paymentSchema.statics.getPaymentsByMethod = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'dates.completedAt': {
          $gte: startDate,
          $lte: endDate
        },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$paymentMethod.type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);