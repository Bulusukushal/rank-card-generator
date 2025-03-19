
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileEdit, PlayCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: 'Create Test',
      description: 'Create a new exam with questions and answers',
      icon: <PlusCircle className="h-12 w-12 text-primary" />,
      path: '/admin/create-test',
    },
    {
      title: 'Update Questions',
      description: 'Modify existing exams and their questions',
      icon: <FileEdit className="h-12 w-12 text-primary" />,
      path: '/admin/update-test',
    },
    {
      title: 'Start/Stop Test',
      description: 'Manage active exams and generate student links',
      icon: <PlayCircle className="h-12 w-12 text-primary" />,
      path: '/admin/manage-test',
    },
  ];
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Card 
            key={index}
            className="overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              {item.icon}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
