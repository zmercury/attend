import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Plus, Trash2, ArrowLeft, Calendar, Users, ChevronLeft, ChevronRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import AttendanceRecord from '../../components/AttendanceRecord';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';

interface Class {
  id: string;
  name: string;
  description: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: boolean | null; // Changed to allow null for unmarked
}

interface UpdatedAttendance {
  id: string;
  student_id: string;
  date: string;
  status: boolean | null;
}

export default function ClassPage() {
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClassData();
      fetchStudents();
    }
  }, [id]);

  useEffect(() => {
    if (id && students.length > 0) {
      fetchAttendance();
    }
  }, [id, students, selectedDate]);

  const fetchClassData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('classes').select('*').eq('id', id).single();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch class data. Please try again.',
      });
    } else {
      setClassData(data);
    }
    setIsLoading(false);
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('students').select('*').eq('class_id', id);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch students. Please try again.',
      });
    } else {
      setStudents(data || []);
    }
    setIsLoading(false);
  };

  const addStudent = async () => {
    const { data, error } = await supabase
      .from('students')
      .insert([{ name: newStudentName, email: newStudentEmail, class_id: id }])
      .select();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add student. Please try again.',
      });
    } else {
      setStudents([...students, data[0]]);
      setNewStudentName('');
      setNewStudentEmail('');
      setIsAddStudentDialogOpen(false);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Student added successfully.',
      });
    }
  };

  const deleteStudent = async () => {
    if (!deleteStudentId) return;
    const { error } = await supabase.from('students').delete().eq('id', deleteStudentId);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete student. Please try again.',
      });
    } else {
      setStudents(students.filter(s => s.id !== deleteStudentId));
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Student deleted successfully.',
      });
    }
    setDeleteStudentId(null);
    setIsDeleteDialogOpen(false);
  };

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('class_id', id)
      .eq('date', format(selectedDate, 'yyyy-MM-dd'));

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch attendance data. Please try again.',
      });
    } else {
      // Initialize attendance data for all students, with no status set
      const fullAttendanceData = students.map(student => ({
        id: '',
        student_id: student.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: null, // Use null to represent unmarked attendance
      }));

      // Update with existing attendance data
      data.forEach(record => {
        const index = fullAttendanceData.findIndex(a => a.student_id === record.student_id);
        if (index !== -1) {
          fullAttendanceData[index] = record;
        }
      });

      setAttendanceData(fullAttendanceData);
    }
  };

  const toggleAttendance = async (studentId: string, status: boolean | null) => {
    const existingRecord = attendanceData.find(a => a.student_id === studentId);

    try {
      let updatedRecord: UpdatedAttendance | null = null;
      if (existingRecord && existingRecord.id) {
        // Update existing record
        if (status === null) {
          // If setting to null (unmarked), delete the record
          const { error } = await supabase.from('attendance').delete().eq('id', existingRecord.id);

          if (error) throw error;
        } else {
          // Update the status
          const { data, error } = await supabase
            .from('attendance')
            .update({ status: status })
            .eq('id', existingRecord.id)
            .select();

          if (error) throw error;
          if (data) {
            updatedRecord = data[0] as UpdatedAttendance;
          }
        }
      } else if (status !== null) {
        // Create new record only if status is not null
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            class_id: id,
            student_id: studentId,
            date: format(selectedDate, 'yyyy-MM-dd'),
            status: status,
          })
          .select();

        if (error) throw error;
        if (data) {
          updatedRecord = data[0] as UpdatedAttendance;
        }
      }

      // Update local state immediately
      setAttendanceData(prevData => {
        if (updatedRecord === null) {
          return prevData.filter(a => a.student_id !== studentId);
        } else {
          return prevData.map(a => (a.student_id === studentId ? { ...a, ...updatedRecord } : a));
        }
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update attendance. Please try again.',
      });
    }
  };

  const renderCalendar = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(selectedDate, 'MMMM yyyy')}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <Button
                key={day.toString()}
                variant={isSameDay(day, selectedDate) ? 'default' : 'outline'}
                className={`h-8 w-8 p-0 ${index === 0 && `col-start-${day.getDay() + 1}`}`}
                onClick={() => setSelectedDate(day)}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAttendanceList = () => {
    const isAnyAttendanceMarked = attendanceData.some(a => a.status !== null);
    const presentCount = attendanceData.filter(a => a.status === true).length;
    const absentCount = attendanceData.filter(a => a.status === false).length;
    const unmarkedCount = attendanceData.filter(a => a.status === null).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <h3 className="text-2xl font-bold text-green-600">{presentCount}</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <h3 className="text-2xl font-bold text-red-600">{absentCount}</h3>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unmarked</p>
                  <h3 className="text-2xl font-bold text-muted-foreground">{unmarkedCount}</h3>
                </div>
                <MinusCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {students.map(student => {
              const attendance = attendanceData.find(a => a.student_id === student.id);
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <RadioGroup
                    onValueChange={value => {
                      if (value === 'unmarked') {
                        toggleAttendance(student.id, null);
                      } else {
                        toggleAttendance(student.id, value === 'present');
                      }
                    }}
                    value={
                      attendance?.status === null
                        ? 'unmarked'
                        : attendance?.status
                          ? 'present'
                          : 'absent'
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="present" id={`present-${student.id}`} />
                      <Label htmlFor={`present-${student.id}`} className="cursor-pointer">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Present
                        </Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                      <Label htmlFor={`absent-${student.id}`} className="cursor-pointer">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Absent
                        </Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unmarked" id={`unmarked-${student.id}`} />
                      <Label htmlFor={`unmarked-${student.id}`} className="cursor-pointer">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Unmarked
                        </Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };

  if (isLoading) return <Loader />;

  if (!classData) return <div>No class data found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: classData?.name || 'Class', href: `/class/${id}` },
              ]}
            />
            <h1 className="text-4xl font-bold mt-4 text-primary">{classData?.name}</h1>
            <p className="text-xl text-muted-foreground mt-2">{classData?.description}</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="attendance" className="space-y-8">
          <TabsList>
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {renderCalendar()}
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                    <CardDescription>
                      Mark attendance for all students in your class
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderAttendanceList()}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Attendance Record</CardTitle>
                <CardDescription>
                  View and export the attendance record for {format(selectedDate, 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceRecord
                  classId={id as string}
                  date={format(selectedDate, 'yyyy-MM-dd')}
                  attendanceData={attendanceData.map(a => ({ ...a, status: a.status || false }))}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>
                      Add, remove, and manage students in your class
                    </CardDescription>
                  </div>
                  <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" /> Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Student Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter student name"
                            value={newStudentName}
                            onChange={e => setNewStudentName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Student Email</Label>
                          <Input
                            id="email"
                            placeholder="Enter student email"
                            value={newStudentEmail}
                            onChange={e => setNewStudentEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={addStudent} className="w-full">Add Student</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">Email</th>
                        <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id} className="border-b">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">{student.email}</td>
                          <td className="text-right py-4 px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteStudentId(student.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this student? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteStudent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

