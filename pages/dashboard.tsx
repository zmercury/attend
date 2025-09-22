import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
//import Breadcrumbs from '../components/Breadcrumbs'

interface Class {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  totalClassDays: number;
}

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    const { data: classesData, error: classesError } = await supabase.from('classes').select('*');

    if (classesError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch classes. Please try again.',
      });
    } else {
      const classesWithDetails = await Promise.all(
        classesData.map(async cls => {
          const { count: studentCount } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', cls.id);

          const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('date')
            .eq('class_id', cls.id);

          if (attendanceError) {
            console.error('Error fetching attendance dates:', attendanceError);
            return { ...cls, studentCount: studentCount || 0, totalClassDays: 0 };
          }

          // Count unique dates
          const uniqueDates = new Set(attendanceData.map(record => record.date));
          const totalClassDays = uniqueDates.size;

          return { ...cls, studentCount: studentCount || 0, totalClassDays };
        })
      );

      setClasses(classesWithDetails);
    }
    setIsLoading(false);
  };

  const createClass = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create a class.',
      });
      return;
    }

    const { data, error } = await supabase
      .from('classes')
      .insert([
        {
          name: newClassName,
          description: newClassDescription,
          teacher_id: user.id,
        },
      ])
      .select();
    if (error) {
      console.error('Error creating class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to create class: ${error.message}`,
      });
    } else {
      setClasses([...classes, data[0]]);
      setNewClassName('');
      setNewClassDescription('');
      setIsCreateDialogOpen(false); // Close the dialog
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Class created successfully.',
      });
    }
  };

  const updateClass = async () => {
    if (!editingClass) return;
    const { error } = await supabase
      .from('classes')
      .update({ name: newClassName, description: newClassDescription })
      .eq('id', editingClass.id);
    if (error) {
      console.error('Error updating class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update class. Please try again.',
      });
    } else {
      setClasses(
        classes.map(c =>
          c.id === editingClass.id
            ? { ...c, name: newClassName, description: newClassDescription }
            : c
        )
      );
      setEditingClass(null);
      setNewClassName('');
      setNewClassDescription('');
      setIsEditDialogOpen(false); // Close the dialog
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Class updated successfully.',
      });
    }
  };

  const deleteClass = async () => {
    if (!deleteClassId) return;
    const { error } = await supabase.from('classes').delete().eq('id', deleteClassId);
    if (error) {
      console.error('Error deleting class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete class. Please try again.',
      });
    } else {
      setClasses(classes.filter(c => c.id !== deleteClassId));
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Class deleted successfully.',
      });
    }
    setDeleteClassId(null);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Welcome back, {user?.user?.user_metadata?.full_name || 'User'}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Your Classes
            </h1>
            <p className="text-muted-foreground mt-2">Manage your classes and track attendance</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Class Name"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                />
                <Input
                  placeholder="Class Description"
                  value={newClassDescription}
                  onChange={e => setNewClassDescription(e.target.value)}
                />
                <Button
                  onClick={createClass}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {classes.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">No Classes Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Get started by creating your first class. You can add students and track
                  attendance once you've created a class.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Your First Class
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {cls.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-muted-foreground">
                          {cls.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingClass(cls);
                                setNewClassName(cls.name);
                                setNewClassDescription(cls.description);
                              }}
                              className="h-8 w-8 hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Class</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <Input
                                placeholder="Class Name"
                                value={newClassName}
                                onChange={e => setNewClassName(e.target.value)}
                              />
                              <Input
                                placeholder="Class Description"
                                value={newClassDescription}
                                onChange={e => setNewClassDescription(e.target.value)}
                              />
                              <Button
                                onClick={updateClass}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              >
                                Update Class
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteClassId(cls.id)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Class</DialogTitle>
                            </DialogHeader>
                            <p className="text-muted-foreground">
                              Are you sure you want to delete this class? This action cannot be
                              undone.
                            </p>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={deleteClass}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                        <Users className="h-5 w-5 text-muted-foreground mb-2" />
                        <span className="text-2xl font-semibold">{cls.studentCount}</span>
                        <span className="text-sm text-muted-foreground">Students</span>
                      </div>
                      <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-2" />
                        <span className="text-2xl font-semibold">{cls.totalClassDays}</span>
                        <span className="text-sm text-muted-foreground">Class Days</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/class/${cls.id}`)}
                      variant="outline"
                      className="w-full hover:bg-primary/10"
                    >
                      View Class Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
