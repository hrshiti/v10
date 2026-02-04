import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../dashboard/Dashboard';
import Enquiries from '../enquiries/Enquiries';
import FollowUps from '../follow-ups/FollowUps';
import Members from '../members/members-list/Members';
import Memberships from '../members/memberships/Memberships';
import MembershipPackages from '../members/membership-packages/MembershipPackages';
import MembersWorkoutCard from '../members/workout-card/MembersWorkoutCard';
import MembershipAnalytics from '../members/analytics/MembershipAnalytics';
import ProfileLayout from '../members/profile/ProfileLayout';
import EditProfile from '../members/profile/EditProfile';
import MemberMemberships from '../members/profile/MemberMemberships';
import MemberFollowUps from '../members/profile/MemberFollowUps';
import MemberPaymentHistory from '../members/profile/MemberPaymentHistory';
import MemberReportCard from '../members/profile/MemberReportCard';
import MemberWorkoutHistory from '../members/profile/MemberWorkoutHistory';
import MemberDietHistory from '../members/profile/MemberDietHistory';
import MemberDocuments from '../members/profile/MemberDocuments';
import MemberBiometric from '../members/profile/MemberBiometric';
import MemberHealthAssessment from '../members/profile/MemberHealthAssessment';
import HealthAssessmentAdd from '../members/profile/HealthAssessmentAdd';
import MemberAttendance from '../members/profile/MemberAttendance';
import FreshSale from '../members/profile/FreshSale';
import TransferMembership from '../members/profile/TransferMembership';
import ResalePlan from '../members/profile/ResalePlan';
import UpgradePlan from '../members/profile/UpgradePlan';
import FreezePlan from '../members/profile/FreezePlan';
import RenewPlan from '../members/profile/RenewPlan';
import FeedbackManagement from '../feedback/FeedbackManagement';
import DietPlanManagement from '../diet-plan/DietPlanManagement';
import SalesReport from '../reports/sales/SalesReport';
import BalanceDueReport from '../reports/balance-due/BalanceDueReport';
import AttendanceReport from '../reports/attendance/AttendanceReport';
import ExpiredMemberReport from '../reports/expired-members/ExpiredMemberReport';
import MembersReportCard from '../reports/members-report-card/MembersReportCard';
import DueMembershipReport from '../reports/due-membership/DueMembershipReport';
import SmsReport from '../reports/sms/SmsReport';
import PtReport from '../reports/pt/PtReport';
import Employees from '../business-settings/team/employees/Employees';
import EmployeeAttendance from '../business-settings/team/employee-attendance/EmployeeAttendance';
import Payments from '../business-settings/payments/Payments';
import InvoiceDetail from '../business-settings/payments/InvoiceDetail';
import ExpenseManagement from '../business-settings/expense-management/ExpenseManagement';
import SlotManagement from '../business-settings/slot-management/SlotManagement';
import GymDetails from '../settings/gym-details/GymDetails';
import Biometric from '../settings/biometric/Biometric';
import AccessControl from '../business-settings/team/access-control/AccessControl';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="follow-ups" element={<FollowUps />} />

                <Route path="members">
                    <Route path="list" element={<Members />} />
                    <Route path="memberships" element={<Memberships />} />
                    <Route path="packages" element={<MembershipPackages />} />
                    <Route path="workout-cards" element={<MembersWorkoutCard />} />
                    <Route path="analytics" element={<MembershipAnalytics />} />
                    <Route path="profile" element={<ProfileLayout />}>
                        <Route path="edit" element={<EditProfile />} />
                        <Route path="memberships" element={<MemberMemberships />} />
                        <Route path="followup" element={<MemberFollowUps />} />
                        <Route path="payment-history" element={<MemberPaymentHistory />} />
                        <Route path="report-card" element={<MemberReportCard />} />
                        <Route path="workout-history" element={<MemberWorkoutHistory />} />
                        <Route path="diet-history" element={<MemberDietHistory />} />
                        <Route path="documents" element={<MemberDocuments />} />
                        <Route path="attendance" element={<MemberAttendance />} />
                        <Route path="biometric" element={<MemberBiometric />} />
                        <Route path="health-assessment" element={<MemberHealthAssessment />} />
                        <Route path="health-assessment-add" element={<HealthAssessmentAdd />} />
                        <Route path="sale/fresh" element={<FreshSale />} />
                        <Route path="membership/transfer" element={<TransferMembership />} />
                        <Route path="membership/resale" element={<ResalePlan />} />
                        <Route path="membership/upgrade" element={<UpgradePlan />} />
                        <Route path="membership/freeze" element={<FreezePlan />} />
                        <Route path="membership/renew" element={<RenewPlan />} />
                    </Route>
                </Route>

                <Route path="feedback" element={<FeedbackManagement />} />
                <Route path="diet-plan" element={<DietPlanManagement />} />

                <Route path="reports">
                    <Route path="sales" element={<SalesReport />} />
                    <Route path="balance-due" element={<BalanceDueReport />} />
                    <Route path="attendance" element={<AttendanceReport />} />
                    <Route path="expired" element={<ExpiredMemberReport />} />
                    <Route path="members" element={<MembersReportCard />} />
                    <Route path="due" element={<DueMembershipReport />} />
                    <Route path="sms" element={<SmsReport />} />
                    <Route path="pt" element={<PtReport />} />
                </Route>

                <Route path="business">
                    <Route path="team" element={<Employees />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="employees/access-control" element={<AccessControl />} />
                    <Route path="attendance" element={<EmployeeAttendance />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="payments/invoice-detail" element={<InvoiceDetail />} />
                    <Route path="expenses" element={<ExpenseManagement />} />
                    <Route path="slots" element={<SlotManagement />} />
                </Route>

                <Route path="settings">
                    <Route path="gym" element={<GymDetails />} />
                    <Route path="biometric" element={<Biometric />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
