import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    medicalId: string;
    phone: string;
    conditions: string[];
    email?: string | null;
    dob?: NativeDate | null;
    allergies?: string | null;
    medications?: string | null;
    notes?: string | null;
    lastVisit?: NativeDate | null;
    address?: string | null;
    insuranceProvider?: string | null;
    policyNumber?: string | null;
    primaryPhysician?: string | null;
    preferredLanguage?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=Patient.d.ts.map