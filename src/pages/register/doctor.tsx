import { useState } from 'react';
import { DoctorRegisterForm } from '@/components/auth/DoctorRegisterForm';
import { MainLayout } from '@/layouts/MainLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DoctorRegisterData } from '@/types/admin';
import { uploadFile } from '@/services/fileUploadService';
import Link from 'next/link';
import { registerDoctorAccount } from '@/services/doctorService';

export default function DoctorRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: DoctorRegisterData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 处理文件上传
      let certificateUrl = '';
      if (data.apcCertificate) {
        const uploadResult = await uploadFile(data.apcCertificate, 'doctor/certificates');
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || '文件上传失败');
        }
        certificateUrl = uploadResult.url;
      }

      // 调用注册API
      await registerDoctorAccount({
        ...data,
        // 文件已经上传，传递URL而不是文件对象
        apcCertificate: data.apcCertificate // 实际API中这里会传递URL
      });

      // 成功处理
      setSubmitSuccess(true);
      
      // 打印注册数据（仅用于调试）
      console.log('医生注册数据：', {
        ...data,
        apcCertificate: certificateUrl
      });
      
    } catch (error) {
      setSubmitError((error as Error).message || '注册失败，请重试');
      console.error('注册失败：', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout title="医生注册">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">医生注册申请</h1>
          <p className="text-muted-foreground">
            请填写以下信息以申请医生账户，我们将审核您的资料
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">注册申请已提交</h2>
            <p className="text-muted-foreground mb-6">
              感谢您的申请！我们的管理员将审核您的资料，并通过邮件通知您审核结果。
              审核通常需要1-2个工作日。
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/">返回首页</Link>
              </Button>
              <Button asChild>
                <Link href="/auth-test">
                  前往测试页面
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            {submitError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>注册失败</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            <DoctorRegisterForm 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
} 