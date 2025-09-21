import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
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
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    transcript: any[];
    dynamicVariables: any;
    toolResults: mongoose.Types.DocumentArray<{
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }> & {
        at: NativeDate;
        dynamicVariables?: any;
        tool?: string | null;
        args?: any;
    }>;
    tags: string[];
    followupRequired: boolean;
    sessionId?: string | null;
    fromNumber?: string | null;
    toNumber?: string | null;
    summary?: string | null;
    isSuccessful?: boolean | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=CallLog.d.ts.map