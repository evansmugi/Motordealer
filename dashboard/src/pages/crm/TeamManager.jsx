import React, { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'

import {
  Users, UserPlus, UserCheck, UserX, Shield, Mail, Phone,
  Building, Search, Filter, Trash2, Edit3, ShieldAlert, CheckCircle2,
  AlertTriangle, RefreshCw, LayoutGrid, List, MoreVertical, X, Clock, Award
} from 'lucide-react'

import PredictiveSelect from '../../components/common/PredictiveSelect'
import ActionTooltip from '../../components/common/ActionTooltip'

const DEPARTMENT_OPTIONS = [
  { value: 'all', label: 'All Departments' },
  { value: 'Sales', label: 'Sales & Business Dev' },
  { value: 'Operations', label: 'Operations & Logistics' },
  { value: 'Marketing', label: 'Marketing & Campaigns' },
  { value: 'Accounts', label: 'Finance & Accounts' },
  { value: 'Support', label: 'Customer Support' },
  { value: 'Executive', label: 'Executive Leadership' }
]

const ACCESS_LEVEL_OPTIONS = [
  { value: 'all', label: 'All Access Levels' },
  { value: 'Admin', label: 'System Admin (Full Access)' },
  { value: 'Manager', label: 'Department Manager' },
  { value: 'Executive', label: 'Senior Executive' },
  { value: 'Staff', label: 'Operational Staff' }
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active User' },
  { value: 'suspended', label: 'Suspended Account' },
  { value: 'on_leave', label: 'On Leave' }
]

export default function TeamManager() {
  const context = useOutletContext() || {}
  const isLight = context.isLight || false

  const teamMembers = useCRMStore(state => state.teamMembers)
  const leads = useCRMStore(state => state.leads)
  const tasks = useCRMStore(state => state.tasks)
  const addTeamMember = useCRMStore(state => state.addTeamMember)
  const updateTeamMember = useCRMStore(state => state.updateTeamMember)
  const toggleTeamMemberStatus = useCRMStore(state => state.toggleTeamMemberStatus)
  const removeTeamMember = useCRMStore(state => state.removeTeamMember)

  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [removingMember, setRemovingMember] = useState(null)
  const [reassignToName, setReassignToName] = useState('')

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Sales',
    access_level: 'Executive',
    status: 'active'
  })

  // Filtered members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = !searchQuery ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDept = departmentFilter === 'all' || member.department === departmentFilter
      const matchesAccess = accessFilter === 'all' || member.access_level === accessFilter

      return matchesSearch && matchesDept && matchesAccess
    })
  }, [teamMembers, searchQuery, departmentFilter, accessFilter])

  // Stats calculation
  const totalCount = teamMembers.length
  const activeCount = teamMembers.filter(m => m.status === 'active').length
  const suspendedCount = teamMembers.filter(m => m.status === 'suspended').length
  const deptsCount = new Set(teamMembers.map(m => m.department)).size

  // Calculate live assigned items for a given member
  const getMemberAssignedStats = (memberName) => {
    const assignedLeads = leads.filter(l => l.assigned_to === memberName).length
    const assignedTasks = tasks.filter(t => t.assigned_to === memberName && t.status !== 'completed').length
    return { leads: assignedLeads, tasks: assignedTasks, total: assignedLeads + assignedTasks }
  }

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: 'Sales',
      access_level: 'Executive',
      status: 'active'
    })
    setShowAddModal(true)
  }

  // Submit Create Employee
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formState.name || !formState.email) return
    await addTeamMember(formState)
    setShowAddModal(false)
  }

  // Open Edit Modal
  const handleOpenEditModal = (member) => {
    setEditingMember(member)
    setFormState({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      department: member.department || 'Sales',
      access_level: member.access_level || 'Executive',
      status: member.status || 'active'
    })
  }

  // Submit Edit Employee
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingMember) return
    await updateTeamMember(editingMember.id, formState)
    setEditingMember(null)
  }

  // Open Remove Modal
  const handleOpenRemoveModal = (member) => {
    setRemovingMember(member)
    const otherActive = teamMembers.filter(m => m.id !== member.id && m.status === 'active')
    setReassignToName(otherActive.length > 0 ? otherActive[0].name : '')
  }

  // Submit Remove Employee
  const handleConfirmRemove = async (e) => {
    e.preventDefault()
    if (!removingMember) return
    const assignedStats = getMemberAssignedStats(removingMember.name)
    const targetReassign = assignedStats.total > 0 ? reassignToName : null
    await removeTeamMember(removingMember.id, targetReassign)
    setRemovingMember(null)
  }

  // Other active members options for re-assignment
  const otherActiveMembersOptions = useMemo(() => {
    if (!removingMember) return []
    return teamMembers
      .filter(m => m.id !== removingMember.id && m.status === 'active')
      .map(m => ({ value: m.name, label: `${m.name} (${m.role} - ${m.department})` }))
  }, [teamMembers, removingMember])

  return (
    <div className="space-y-6 font-sans">
      {/* --- PAGE HEADER BANNER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[3px] uppercase font-bold text-[#c9a84c] block">
              FUSE ERP • SYSTEM ADMINISTRATION
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
              ROSTER MANAGEMENT
            </span>
          </div>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Employee &amp; System User Management
          </h1>
          <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Add, update roles, manage department access levels, and offboard system staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* --- METRICS SUMMARY CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">Total System Users</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users size={20} />
            </div>
          </div>
          <h2 className={`text-3xl font-serif font-light mt-3 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{totalCount}</h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Registered System Staff</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400">Active Executives</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-light mt-3 text-emerald-400">{activeCount}</h2>
          <p className="text-[11px] font-mono text-emerald-500/80 mt-1">Active Duty Status</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-rose-400">Suspended / Deactive</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <UserX size={20} />
            </div>
          </div>
          <h2 className={`text-3xl font-serif font-light mt-3 ${suspendedCount > 0 ? 'text-rose-400' : (isLight ? 'text-slate-900' : 'text-slate-100')}`}>{suspendedCount}</h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Access Restricted</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400">Active Departments</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-light mt-3 text-amber-400">{deptsCount}</h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Cross-Functional Divisions</p>
        </div>
      </div>

      {/* --- TOOLBAR & FILTER CONTROLS --- */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Live Search */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee name, email, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono outline-none border transition-all ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
              }`}
            />
          </div>

          {/* Department Filter using PredictiveSelect */}
          <div className="w-full sm:w-56">
            <PredictiveSelect
              options={DEPARTMENT_OPTIONS}
              value={departmentFilter}
              onChange={val => setDepartmentFilter(val || 'all')}
              isLight={isLight}
              placeholder="Filter Department"
            />
          </div>

          {/* Access Level Filter using PredictiveSelect */}
          <div className="w-full sm:w-56">
            <PredictiveSelect
              options={ACCESS_LEVEL_OPTIONS}
              value={accessFilter}
              onChange={val => setAccessFilter(val || 'all')}
              isLight={isLight}
              placeholder="Filter Access Level"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-slate-950/40">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#c9a84c] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline text-[11px] font-mono uppercase">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-[#c9a84c] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Data Table View"
          >
            <List size={15} />
            <span className="hidden sm:inline text-[11px] font-mono uppercase">Table</span>
          </button>
        </div>
      </div>

      {/* --- MAIN DISPLAY CONTENT --- */}
      {filteredMembers.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-3 ${
          isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/60 border-white/10 text-slate-400'
        }`}>
          <UserX size={48} className="mx-auto text-slate-500 opacity-60" />
          <h3 className="text-lg font-serif font-light">No System Employees Found</h3>
          <p className="text-xs font-mono max-w-md mx-auto">
            No employee profiles matched your search or department filter criteria. Try resetting your search filters or click "Add New Employee".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setDepartmentFilter('all'); setAccessFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-amber-400 hover:bg-slate-700 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map(member => {
            const stats = getMemberAssignedStats(member.name)
            const isSuspended = member.status === 'suspended'

            return (
              <div
                key={member.id}
                className={`p-5 rounded-3xl border transition-all duration-300 relative group flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-md hover:border-[#c9a84c]/50'
                    : 'bg-slate-900/80 border-white/10 hover:border-[#c9a84c]/40 hover:shadow-xl hover:shadow-[#c9a84c]/5'
                }`}
              >
                <div>
                  {/* Card Top Row: Initials Badge & Status Pill */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-lg font-bold border shadow-inner ${
                        isSuspended
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : member.access_level === 'Admin'
                            ? 'bg-gradient-to-br from-[#c9a84c]/20 to-amber-500/20 border-[#c9a84c]/40 text-[#c9a84c]'
                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      }`}>
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className={`text-base font-serif font-semibold group-hover:text-[#c9a84c] transition-colors ${
                          isLight ? 'text-slate-900' : 'text-slate-100'
                        }`}>
                          {member.name}
                        </h3>
                        <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {member.role || 'System Executive'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      isSuspended
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : member.status === 'on_leave'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {member.status === 'active' ? 'Active' : member.status === 'suspended' ? 'Suspended' : 'On Leave'}
                    </span>
                  </div>

                  {/* Department & Access Level Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/60 border border-white/10 text-slate-300">
                      🏢 {member.department || 'Sales'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      member.access_level === 'Admin'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        : member.access_level === 'Manager'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      🛡️ {member.access_level || 'Executive'}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className={`space-y-1.5 text-xs font-mono p-3 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/50 border-white/5 text-slate-300'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={13} className="text-[#c9a84c] shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-emerald-400 shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Active Workload Stats & Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span>Active Leads: <strong className="text-amber-400">{stats.leads}</strong></span>
                    <span>Tasks: <strong className="text-indigo-400">{stats.tasks}</strong></span>
                  </div>

                  <div className="flex items-center gap-1">
                    <ActionTooltip text={isSuspended ? "Activate User" : "Suspend User Access"}>
                      <button
                        onClick={() => toggleTeamMemberStatus(member.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSuspended
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {isSuspended ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                    </ActionTooltip>

                    <ActionTooltip text="Edit Employee Profile">
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-[#c9a84c] transition-all cursor-pointer"
                      >
                        <Edit3 size={14} />
                      </button>
                    </ActionTooltip>

                    <ActionTooltip text="Remove / Offboard Employee">
                      <button
                        onClick={() => handleOpenRemoveModal(member)}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </ActionTooltip>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className={`rounded-3xl border overflow-hidden shadow-xl ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="overflow-x-auto crm-scroll">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950/80 border-white/10 text-slate-400'
                }`}>
                  <th className="py-3.5 px-4">Employee Name</th>
                  <th className="py-3.5 px-4">Role &amp; Title</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Access Level</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Active Workload</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map(member => {
                  const stats = getMemberAssignedStats(member.name)
                  const isSuspended = member.status === 'suspended'

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-xs border ${
                            isSuspended ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40'
                          }`}>
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className={`font-semibold font-serif text-sm block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {member.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {member.role || 'Executive'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-950/60 border border-white/10 text-slate-300">
                          {member.department || 'Sales'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] border ${
                          member.access_level === 'Admin' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {member.access_level || 'Executive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="text-[11px] text-slate-300">{member.email}</div>
                        <div className="text-[10px] text-slate-500">{member.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                          isSuspended ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-amber-400 font-bold">{stats.leads} Leads</span> / <span className="text-indigo-400 font-bold">{stats.tasks} Tasks</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleTeamMemberStatus(member.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isSuspended ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}
                            title={isSuspended ? 'Activate' : 'Suspend'}
                          >
                            {isSuspended ? <UserCheck size={13} /> : <UserX size={13} />}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleOpenRemoveModal(member)}
                            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD NEW EMPLOYEE / USER --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Add New Employee Profile</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Register new user account for system access &amp; CRM deal assignments.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 font-mono text-xs">
              {/* Full Name */}
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Employee Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kevin Omwamba"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="k.omwamba@kkautomotive.co.ke"
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={formState.phone}
                    onChange={e => setFormState({ ...formState, phone: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              {/* Department & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Department Division
                  </label>
                  <PredictiveSelect
                    options={DEPARTMENT_OPTIONS.filter(o => o.value !== 'all')}
                    value={formState.department}
                    onChange={val => setFormState({ ...formState, department: val || 'Sales' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Official Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Fleet Executive"
                    value={formState.role}
                    onChange={e => setFormState({ ...formState, role: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              {/* Access Level & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    System Access Level
                  </label>
                  <PredictiveSelect
                    options={ACCESS_LEVEL_OPTIONS.filter(o => o.value !== 'all')}
                    value={formState.access_level}
                    onChange={val => setFormState({ ...formState, access_level: val || 'Executive' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Account Status
                  </label>
                  <PredictiveSelect
                    options={STATUS_OPTIONS}
                    value={formState.status}
                    onChange={val => setFormState({ ...formState, status: val || 'active' })}
                    isLight={isLight}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2.5 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  <span>Create User Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT EMPLOYEE PROFILE --- */}
      {editingMember && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setEditingMember(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Edit Employee Profile</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Editing User ID: <span className="text-[#c9a84c] font-bold">{editingMember.id}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Employee Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2.5 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={e => setFormState({ ...formState, phone: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Department
                  </label>
                  <PredictiveSelect
                    options={DEPARTMENT_OPTIONS.filter(o => o.value !== 'all')}
                    value={formState.department}
                    onChange={val => setFormState({ ...formState, department: val || 'Sales' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={formState.role}
                    onChange={e => setFormState({ ...formState, role: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Access Level
                  </label>
                  <PredictiveSelect
                    options={ACCESS_LEVEL_OPTIONS.filter(o => o.value !== 'all')}
                    value={formState.access_level}
                    onChange={val => setFormState({ ...formState, access_level: val || 'Executive' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Status
                  </label>
                  <PredictiveSelect
                    options={STATUS_OPTIONS}
                    value={formState.status}
                    onChange={val => setFormState({ ...formState, status: val || 'active' })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className={`px-4 py-2.5 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-500 transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: REMOVE / OFFBOARD EMPLOYEE SAFEGUARD MODAL --- */}
      {removingMember && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-rose-300 text-slate-900' : 'bg-[#0f172a] border-rose-500/30 text-slate-100'
          }`}>
            <button
              onClick={() => setRemovingMember(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light text-rose-500">Offboard Employee</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Safeguard Protocol &amp; Workload Reassignment
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRemove} className="space-y-4 font-mono text-xs">
              <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Are you sure you want to remove <strong className="text-rose-400">{removingMember.name}</strong> from the system staff directory?
              </p>

              {/* Workload Check */}
              {(() => {
                const stats = getMemberAssignedStats(removingMember.name)
                if (stats.total > 0) {
                  return (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertTriangle size={15} />
                        <span>Active Assigned Workload Detected:</span>
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        This employee currently has <strong className="text-amber-200">{stats.leads} assigned leads</strong> and <strong className="text-amber-200">{stats.tasks} pending tasks</strong>. Select an active executive to re-assign all records to:
                      </p>

                      <div>
                        <label className="block font-bold mb-1 text-[11px] text-amber-200">Reassign Workload To:</label>
                        <PredictiveSelect
                          options={otherActiveMembersOptions}
                          value={reassignToName}
                          onChange={val => setReassignToName(val || '')}
                          isLight={isLight}
                        />
                      </div>
                    </div>
                  )
                }
                return (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-slate-400 text-[11px]">
                    ✓ No active pending leads or tasks assigned to this user.
                  </div>
                )
              })()}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRemovingMember(null)}
                  className={`px-4 py-2.5 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel Keep User
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold uppercase tracking-wider hover:bg-rose-500 transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Confirm Offboard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
