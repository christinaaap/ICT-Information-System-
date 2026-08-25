import { supabase } from '../supabase';
import {
  User,
  UserInsert,
  UserUpdate,
  Asset,
  AssetInsert,
  AssetUpdate,
  Ticket,
  TicketInsert,
  TicketUpdate,
  Attendance,
  AttendanceInsert,
  AttendanceUpdate,
  LeaveRequest,
  LeaveRequestInsert,
  LeaveRequestUpdate,
  LeaveApproval,
  LeaveApprovalInsert,
  LeaveApprovalUpdate,
  IctDocument,
  IctDocumentInsert,
  IctDocumentUpdate,
} from '../../src/types';

export class Database {
  // ==========================
  // USERS REPOSITORY
  // ==========================
  public async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, department, work_location, role, extension, created_at, must_change_password')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as User[];
  }

  public async findUserById(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, department, work_location, role, extension, created_at, must_change_password')
      .eq('id', id)
      .single();
    if (error) return undefined;
    return data as User;
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email.trim())
      .single();
    if (error) return undefined;
    return data as User;
  }

  public async createUser(user: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  }

  public async updateUser(id: number, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as User;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    return !error;
  }

  // ==========================
  // ASSETS REPOSITORY
  // ==========================
  public async getAllAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Asset[];
  }

  public async createAsset(asset: AssetInsert): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    if (error) throw error;
    return data as Asset;
  }

  public async updateAsset(id: number, updates: AssetUpdate): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as Asset;
  }

  public async deleteAsset(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    return !error;
  }

  public async bulkInsertAssets(newAssets: AssetInsert[]): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .upsert(newAssets, { onConflict: 'serial_number' })
      .select();
    if (error) throw error;
    return data as Asset[];
  }

  public async clearAssets(): Promise<void> {
    await supabase.from('assets').delete().neq('id', 0);
  }

  // ==========================
  // TICKETS REPOSITORY
  // ==========================
  public async getAllTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Ticket[];
  }

  public async createTicket(ticket: TicketInsert): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();
    if (error) throw error;
    return data as Ticket;
  }

  public async updateTicketStatus(
    id: number,
    status: Ticket['status'],
    notes?: string
  ): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status,
        resolution_notes: notes,
        updated_at: new Date().toISOString(),
      } satisfies TicketUpdate)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as Ticket;
  }

  public async deleteTicket(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    return !error;
  }

  public async clearTickets(): Promise<void> {
    await supabase.from('tickets').delete().neq('id', 0);
  }

  // ==========================
  // ATTENDANCES REPOSITORY
  // ==========================
  public async getAllAttendances(): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Attendance[];
  }

  public async createAttendance(att: AttendanceInsert): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendances')
      .insert(att)
      .select()
      .single();
    if (error) throw error;
    return data as Attendance;
  }

  public async clearAttendances(): Promise<void> {
    await supabase.from('attendances').delete().neq('id', 0);
  }

  // ==========================
  // LEAVE REPOSITORY
  // ==========================
  public async getAllLeaves(): Promise<LeaveRequest[]> {
    const { data: leaves, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const { data: approvals } = await supabase
      .from('leave_approvals')
      .select('*');

    const approvalsByLeave = (approvals || []).reduce((acc, a) => {
      if (!acc[a.leave_id]) acc[a.leave_id] = [];
      acc[a.leave_id].push(a as LeaveApproval);
      return acc;
    }, {} as Record<number, LeaveApproval[]>);

    return (leaves as LeaveRequest[]).map(leave => ({
      ...leave,
      approvals: approvalsByLeave[leave.id] || [],
    }));
  }

  public async createLeave(leaveData: LeaveRequestInsert): Promise<LeaveRequest> {
    const { data: createdLeave, error } = await supabase
      .from('leave_requests')
      .insert(leaveData)
      .select()
      .single();
    if (error) throw error;

    const defaultApprovals: LeaveApprovalInsert[] = [
      {
        leave_id: createdLeave.id,
        approver_id: null,
        approver_name: 'Direct Leader / SPV',
        approver_role: 'leader',
        step_order: 1,
        status: 'Pending',
        signature_data: null,
        approved_at: null,
      },
      {
        leave_id: createdLeave.id,
        approver_id: null,
        approver_name: 'CSBO Section Head',
        approver_role: 'csbo',
        step_order: 2,
        status: 'Pending',
        signature_data: null,
        approved_at: null,
      },
      {
        leave_id: createdLeave.id,
        approver_id: null,
        approver_name: 'SPMO Department Manager',
        approver_role: 'spmo',
        step_order: 3,
        status: 'Pending',
        signature_data: null,
        approved_at: null,
      },
    ];

    await supabase.from('leave_approvals').insert(defaultApprovals);

    return { ...createdLeave, approvals: defaultApprovals } as LeaveRequest;
  }

  public async updateLeaveApproval(
    leaveId: number,
    stepOrder: number,
    approverId: number,
    approverName: string,
    status: 'Approved' | 'Rejected',
    signatureData: string,
    notes?: string
  ): Promise<LeaveRequest | null> {
    const approvalStatus = status as 'Pending' | 'Approved' | 'Rejected';
    const { data: approval, error: approvalError } = await supabase
      .from('leave_approvals')
      .update({
        approver_id: approverId,
        approver_name: approverName,
        status: approvalStatus,
        signature_data: signatureData,
        approved_at: new Date().toISOString(),
        notes: notes || null,
      } satisfies LeaveApprovalUpdate)
      .eq('leave_id', leaveId)
      .eq('step_order', stepOrder)
      .select()
      .single();

    if (approvalError) return null;

    const { data: leave, error: leaveError } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', leaveId)
      .single();

    if (leaveError) return null;

    let newStatus: 'Pending' | 'Approved' | 'Rejected' = leave.status as 'Pending' | 'Approved' | 'Rejected';
    let newStep = leave.current_step;

    if (status === 'Rejected') {
      newStatus = 'Rejected';
    } else if (stepOrder === 3 && status === 'Approved') {
      newStatus = 'Approved';
    } else if (status === 'Approved') {
      newStep = stepOrder + 1;
    }

    await supabase
      .from('leave_requests')
      .update({ status: newStatus, current_step: newStep } satisfies LeaveRequestUpdate)
      .eq('id', leaveId);

    const { data: allApprovals } = await supabase
      .from('leave_approvals')
      .select('*')
      .eq('leave_id', leaveId);

    return { ...leave, status: newStatus, current_step: newStep, approvals: allApprovals || [] } as LeaveRequest;
  }

  public async clearLeaves(): Promise<void> {
    await supabase.from('leave_approvals').delete().neq('id', 0);
    await supabase.from('leave_requests').delete().neq('id', 0);
  }

  // ==========================
  // DOCUMENTS REPOSITORY
  // ==========================
  public async getAllDocuments(): Promise<IctDocument[]> {
    const { data, error } = await supabase
      .from('ict_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as IctDocument[];
  }

  public async createDocument(doc: IctDocumentInsert): Promise<IctDocument> {
    const { data, error } = await supabase
      .from('ict_documents')
      .insert(doc)
      .select()
      .single();
    if (error) throw error;
    return data as IctDocument;
  }

  public async deleteDocument(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('ict_documents')
      .delete()
      .eq('id', id);
    return !error;
  }

  public async clearDocuments(): Promise<void> {
    await supabase.from('ict_documents').delete().neq('id', 0);
  }
}

export const db = new Database();