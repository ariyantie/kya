const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    fullName: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
      default: 'single'
    },
    motherMaidenName: String,
    placeOfBirth: String
  },

  // Contact Information
  contact: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^(\+62|62|0)[0-9]{8,13}$/, 'Please enter a valid Indonesian phone number']
    },
    alternatePhone: String,
    whatsappNumber: String
  },

  // Address Information
  address: {
    current: {
      street: { type: String, required: true },
      village: String,
      district: String,
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Indonesia' },
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      residenceType: {
        type: String,
        enum: ['owned', 'rented', 'family', 'other'],
        default: 'owned'
      },
      stayDuration: Number // in months
    },
    permanent: {
      street: String,
      village: String,
      district: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: 'Indonesia' },
      isSameAsCurrent: { type: Boolean, default: true }
    }
  },

  // Authentication
  auth: {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    pin: {
      type: String,
      length: 6,
      select: false
    },
    biometric: {
      fingerprint: String,
      faceId: String
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false }
  },

  // Identity Documents
  documents: {
    ktp: {
      number: {
        type: String,
        required: [true, 'KTP number is required'],
        unique: true,
        length: 16
      },
      imageUrl: String,
      verified: { type: Boolean, default: false },
      verifiedAt: Date
    },
    kk: {
      number: String,
      imageUrl: String,
      verified: { type: Boolean, default: false }
    },
    npwp: {
      number: String,
      imageUrl: String,
      verified: { type: Boolean, default: false }
    },
    passport: {
      number: String,
      imageUrl: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    },
    drivingLicense: {
      number: String,
      imageUrl: String,
      expiryDate: Date,
      type: String
    }
  },

  // Employment Information
  employment: {
    status: {
      type: String,
      enum: ['employed', 'self_employed', 'unemployed', 'student', 'retired'],
      required: [true, 'Employment status is required']
    },
    companyName: String,
    companyAddress: String,
    companyPhone: String,
    position: String,
    department: String,
    workStartDate: Date,
    monthlyIncome: {
      type: Number,
      required: [true, 'Monthly income is required'],
      min: [0, 'Income cannot be negative']
    },
    additionalIncome: Number,
    incomeProof: [String], // Array of image URLs
    workCertificate: String,
    payslips: [String] // Last 3 months payslips
  },

  // Banking Information
  banking: {
    accountNumber: {
      type: String,
      required: [true, 'Bank account number is required']
    },
    accountName: String,
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    bankCode: String,
    branch: String,
    accountType: {
      type: String,
      enum: ['savings', 'current', 'salary'],
      default: 'savings'
    },
    verified: { type: Boolean, default: false },
    eWallets: [{
      provider: { type: String, enum: ['gopay', 'ovo', 'dana', 'linkaja', 'shopeepay'] },
      accountNumber: String,
      verified: { type: Boolean, default: false }
    }]
  },

  // Credit Information
  creditInfo: {
    creditScore: {
      type: Number,
      min: 300,
      max: 850,
      default: 500
    },
    creditHistory: [{
      source: String,
      score: Number,
      reportDate: Date,
      status: String
    }],
    existingLoans: [{
      lender: String,
      amount: Number,
      remainingAmount: Number,
      monthlyPayment: Number,
      status: { type: String, enum: ['active', 'paid', 'defaulted'] }
    }],
    totalExistingDebt: { type: Number, default: 0 },
    debtToIncomeRatio: Number
  },

  // Emergency Contacts
  emergencyContacts: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String,
    isPrimary: { type: Boolean, default: false }
  }],

  // Profile & Preferences
  profile: {
    profilePicture: String,
    preferredLanguage: { type: String, default: 'id', enum: ['id', 'en'] },
    timezone: { type: String, default: 'Asia/Jakarta' },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false }
    }
  },

  // Account Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'blocked', 'closed'],
    default: 'pending'
  },

  // Verification Status
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false },
    income: { type: Boolean, default: false },
    address: { type: Boolean, default: false },
    banking: { type: Boolean, default: false },
    isFullyVerified: { type: Boolean, default: false },
    kycLevel: { type: Number, min: 0, max: 3, default: 0 },
    verificationScore: { type: Number, min: 0, max: 100, default: 0 }
  },

  // Security & Activity
  security: {
    lastLogin: Date,
    lastLoginIP: String,
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },
    refreshTokens: [{ type: String, select: false }]
  },

  // App Usage
  appInfo: {
    deviceId: String,
    appVersion: String,
    platform: { type: String, enum: ['android', 'ios', 'web'] },
    fcmToken: String, // For push notifications
    installDate: { type: Date, default: Date.now },
    lastActiveDate: Date
  },

  // Risk Assessment
  riskProfile: {
    riskScore: { type: Number, min: 0, max: 100, default: 50 },
    riskCategory: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'very_high'], 
      default: 'medium' 
    },
    blacklisted: { type: Boolean, default: false },
    blacklistReason: String,
    fraudAlerts: [{
      type: String,
      description: String,
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      date: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false }
    }]
  },

  // Referral System
  referral: {
    referralCode: {
      type: String,
      unique: true,
      uppercase: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referralCount: { type: Number, default: 0 },
    referralRewards: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ 'contact.email': 1 });
userSchema.index({ 'contact.phone': 1 });
userSchema.index({ 'documents.ktp.number': 1 });
userSchema.index({ 'referral.referralCode': 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'verification.isFullyVerified': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('personalInfo.fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age
userSchema.virtual('personalInfo.age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (!this.isModified('auth.password')) return next();
  
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.auth.password = await bcrypt.hash(this.auth.password, saltRounds);
  next();
});

// Generate referral code before save
userSchema.pre('save', function(next) {
  if (!this.referral.referralCode) {
    this.referral.referralCode = this.generateReferralCode();
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.auth.password);
};

userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    email: this.contact.email,
    phone: this.contact.phone,
    role: 'user'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

userSchema.methods.generateRefreshToken = function() {
  const payload = {
    id: this._id,
    type: 'refresh'
  };
  
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
};

userSchema.methods.generateReferralCode = function() {
  const prefix = 'MK';
  const userId = this._id.toString().slice(-6).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${userId}${random}`;
};

userSchema.methods.calculateVerificationScore = function() {
  let score = 0;
  
  if (this.verification.email) score += 15;
  if (this.verification.phone) score += 15;
  if (this.verification.identity) score += 25;
  if (this.verification.income) score += 20;
  if (this.verification.address) score += 15;
  if (this.verification.banking) score += 10;
  
  this.verification.verificationScore = score;
  this.verification.isFullyVerified = score >= 90;
  
  return score;
};

userSchema.methods.updateRiskScore = function() {
  let riskScore = 50; // Base score
  
  // Age factor
  const age = this.personalInfo.age;
  if (age < 21) riskScore += 15;
  else if (age > 60) riskScore += 10;
  else if (age >= 25 && age <= 45) riskScore -= 5;
  
  // Income factor
  const income = this.employment.monthlyIncome;
  if (income < 3000000) riskScore += 20;
  else if (income > 10000000) riskScore -= 10;
  
  // Employment factor
  if (this.employment.status === 'unemployed') riskScore += 25;
  else if (this.employment.status === 'employed') riskScore -= 10;
  
  // Verification factor
  riskScore -= (this.verification.verificationScore / 100) * 20;
  
  // Credit history factor
  if (this.creditInfo.creditScore > 700) riskScore -= 15;
  else if (this.creditInfo.creditScore < 500) riskScore += 20;
  
  // Existing debt factor
  if (this.creditInfo.debtToIncomeRatio > 0.5) riskScore += 15;
  
  // Ensure score is within bounds
  riskScore = Math.max(0, Math.min(100, riskScore));
  
  this.riskProfile.riskScore = riskScore;
  
  // Set risk category
  if (riskScore <= 25) this.riskProfile.riskCategory = 'low';
  else if (riskScore <= 50) this.riskProfile.riskCategory = 'medium';
  else if (riskScore <= 75) this.riskProfile.riskCategory = 'high';
  else this.riskProfile.riskCategory = 'very_high';
  
  return riskScore;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ 'contact.email': email.toLowerCase() });
};

userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ 'contact.phone': phone });
};

userSchema.statics.findByKTP = function(ktpNumber) {
  return this.findOne({ 'documents.ktp.number': ktpNumber });
};

module.exports = mongoose.model('User', userSchema);