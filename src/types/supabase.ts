export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          email: string;
          password: string;
          department: string;
          work_location: string;
          role: string;
          extension: string | null;
          must_change_password: boolean;
          created_at: string;
        };
        Insert: {
          id?: never;
          name: string;
          email: string;
          password: string;
          department: string;
          work_location: string;
          role?: string;
          extension?: string | null;
          must_change_password?: boolean;
          created_at?: string;
        };
        Update: {
          id?: never;
          name?: string;
          email?: string;
          password?: string;
          department?: string;
          work_location?: string;
          role?: string;
          extension?: string | null;
          must_change_password?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: number;
          product_name: string;
          type_name: string;
          serial_number: string;
          hostname: string;
          user_id: number | null;
          user_name: string | null;
          work_location: string;
          location: string;
          asset_state: string;
          installed_apps: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          product_name: string;
          type_name: string;
          serial_number: string;
          hostname: string;
          user_id?: number | null;
          user_name?: string | null;
          work_location: string;
          location: string;
          asset_state?: string;
          installed_apps?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          product_name?: string;
          type_name?: string;
          serial_number?: string;
          hostname?: string;
          user_id?: number | null;
          user_name?: string | null;
          work_location?: string;
          location?: string;
          asset_state?: string;
          installed_apps?: string[] | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tickets: {
        Row: {
          id: number;
          ticket_code: string;
          requester_id: number;
          requester_name: string;
          requester_email: string;
          requester_extension: string | null;
          created_by_role: string;
          subject: string;
          body: string;
          category: string;
          department: string;
          work_location: string;
          status: string;
          resolution_notes: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          ticket_code: string;
          requester_id: number;
          requester_name: string;
          requester_email: string;
          requester_extension?: string | null;
          created_by_role?: string;
          subject: string;
          body: string;
          category: string;
          department: string;
          work_location: string;
          status?: string;
          resolution_notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: never;
          ticket_code?: string;
          requester_id?: number;
          requester_name?: string;
          requester_email?: string;
          requester_extension?: string | null;
          created_by_role?: string;
          subject?: string;
          body?: string;
          category?: string;
          department?: string;
          work_location?: string;
          status?: string;
          resolution_notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      attendances: {
        Row: {
          id: number;
          user_id: number;
          user_name: string;
          user_email: string;
          user_role: string;
          clock_in: string;
          photo_path: string | null;
          latitude: string;
          longitude: string;
          work_location: string;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          user_id: number;
          user_name: string;
          user_email: string;
          user_role: string;
          clock_in: string;
          photo_path?: string | null;
          latitude: string;
          longitude: string;
          work_location: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          user_id?: number;
          user_name?: string;
          user_email?: string;
          user_role?: string;
          clock_in?: string;
          photo_path?: string | null;
          latitude?: string;
          longitude?: string;
          work_location?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendances_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      leave_requests: {
        Row: {
          id: number;
          user_id: number;
          user_name: string;
          user_email: string;
          user_department: string;
          user_work_location: string;
          user_extension: string | null;
          reason: string;
          start_date: string;
          end_date: string;
          total_days: number;
          status: string;
          current_step: number;
          created_at: string;
        };
        Insert: {
          id?: never;
          user_id: number;
          user_name: string;
          user_email: string;
          user_department: string;
          user_work_location: string;
          user_extension?: string | null;
          reason: string;
          start_date: string;
          end_date: string;
          total_days?: number;
          status?: string;
          current_step?: number;
          created_at?: string;
        };
        Update: {
          id?: never;
          user_id?: number;
          user_name?: string;
          user_email?: string;
          user_department?: string;
          user_work_location?: string;
          user_extension?: string | null;
          reason?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          status?: string;
          current_step?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leave_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      leave_approvals: {
        Row: {
          id: number;
          leave_id: number;
          approver_id: number | null;
          approver_name: string;
          approver_role: string;
          step_order: number;
          status: string;
          signature_data: string | null;
          approved_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: never;
          leave_id: number;
          approver_id?: number | null;
          approver_name: string;
          approver_role: string;
          step_order: number;
          status?: string;
          signature_data?: string | null;
          approved_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: never;
          leave_id?: number;
          approver_id?: number | null;
          approver_name?: string;
          approver_role?: string;
          step_order?: number;
          status?: string;
          signature_data?: string | null;
          approved_at?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leave_approvals_leave_id_fkey";
            columns: ["leave_id"];
            isOneToOne: false;
            referencedRelation: "leave_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leave_approvals_approver_id_fkey";
            columns: ["approver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      ict_documents: {
        Row: {
          id: number;
          doc_code: string;
          title: string;
          category: string;
          file_path: string;
          uploaded_by: number | null;
          uploaded_by_name: string;
          size_kb: number;
          version: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          doc_code: string;
          title: string;
          category: string;
          file_path: string;
          uploaded_by?: number | null;
          uploaded_by_name: string;
          size_kb?: number;
          version?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          doc_code?: string;
          title?: string;
          category?: string;
          file_path?: string;
          uploaded_by?: number | null;
          uploaded_by_name?: string;
          size_kb?: number;
          version?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ict_documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}