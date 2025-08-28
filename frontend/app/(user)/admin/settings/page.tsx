'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Switch } from '@heroui/switch'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Textarea } from '@heroui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import FilterIcon from '@/components/icons/FilterIcon'
import SecurityIcon from '@/components/icons/SecurityIcon'
import BellIcon from '@/components/icons/BellIcon'
import SaveIcon from '@/components/icons/SaveIcon'

const AdminSettings = () => {
  const router = useRouter()
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'سیستم وفاداری',
    appDescription: 'سیستم مدیریت وفاداری مشتریان',
    timezone: 'Asia/Tehran',
    language: 'fa',
    maintenanceMode: false,
    
    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireOTP: true,
    passwordMinLength: 8,
    enableRateLimiting: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: 'immediate',
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    logRetention: 90,
    debugMode: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings)
    // Show success message
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      appName: 'سیستم وفاداری',
      appDescription: 'سیستم مدیریت وفاداری مشتریان',
      timezone: 'Asia/Tehran',
      language: 'fa',
      maintenanceMode: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireOTP: true,
      passwordMinLength: 8,
      enableRateLimiting: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notificationFrequency: 'immediate',
      autoBackup: true,
      backupFrequency: 'daily',
      logRetention: 90,
      debugMode: false,
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilterIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">تنظیمات سیستم</h1>
            <p className="text-text-light">مدیریت تنظیمات و پیکربندی سیستم وفاداری</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="default"
            variant="flat"
            onPress={handleReset}
          >
            بازنشانی
          </Button>
          <Button
            color="primary"
            startContent={<SaveIcon className="size-5" />}
            onPress={handleSave}
          >
            ذخیره تنظیمات
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <FilterIcon className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-text-dark">تنظیمات عمومی</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                نام برنامه
              </label>
              <Input
                value={settings.appName}
                onChange={(e) => handleSettingChange('appName', e.target.value)}
                placeholder="نام برنامه"
                variant="bordered"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                منطقه زمانی
              </label>
              <Select
                selectedKeys={[settings.timezone]}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                variant="bordered"
              >
                <SelectItem key="Asia/Tehran">تهران (GMT+3:30)</SelectItem>
                <SelectItem key="UTC">UTC (GMT+0)</SelectItem>
                <SelectItem key="Europe/London">لندن (GMT+0)</SelectItem>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              توضیحات برنامه
            </label>
            <Textarea
              value={settings.appDescription}
              onChange={(e) => handleSettingChange('appDescription', e.target.value)}
              placeholder="توضیحات برنامه"
              variant="bordered"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
            <div>
              <h4 className="font-medium text-text-dark">حالت نگهداری</h4>
              <p className="text-sm text-text-light">فعال کردن حالت نگهداری برای تعمیرات</p>
            </div>
            <Switch
              isSelected={settings.maintenanceMode}
              onValueChange={(value) => handleSettingChange('maintenanceMode', value)}
              color="warning"
            />
          </div>
        </CardBody>
      </Card>

      {/* Security Settings */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <SecurityIcon className="size-6 text-danger" />
            <h3 className="text-lg font-semibold text-text-dark">تنظیمات امنیتی</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                مدت زمان نشست (دقیقه)
              </label>
              <Input
                type="number"
                value={settings.sessionTimeout.toString()}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
                variant="bordered"
                min={5}
                max={480}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                حداکثر تلاش ورود
              </label>
              <Input
                type="number"
                value={settings.maxLoginAttempts.toString()}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                placeholder="5"
                variant="bordered"
                min={3}
                max={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">نیاز به OTP</h4>
                <p className="text-sm text-text-light">تایید دو مرحله‌ای برای ورود</p>
              </div>
              <Switch
                isSelected={settings.requireOTP}
                onValueChange={(value) => handleSettingChange('requireOTP', value)}
                color="primary"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">محدودیت نرخ</h4>
                <p className="text-sm text-text-light">محدود کردن درخواست‌های API</p>
              </div>
              <Switch
                isSelected={settings.enableRateLimiting}
                onValueChange={(value) => handleSettingChange('enableRateLimiting', value)}
                color="primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              حداقل طول رمز عبور
            </label>
            <Input
              type="number"
              value={settings.passwordMinLength.toString()}
              onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
              placeholder="8"
              variant="bordered"
              min={6}
              max={20}
            />
          </div>
        </CardBody>
      </Card>

      {/* Notification Settings */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <BellIcon className="size-6 text-warning" />
            <h3 className="text-lg font-semibold text-text-dark">تنظیمات اعلان‌ها</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">اعلان‌های ایمیل</h4>
                <p className="text-sm text-text-light">ارسال اعلان از طریق ایمیل</p>
              </div>
              <Switch
                isSelected={settings.emailNotifications}
                onValueChange={(value) => handleSettingChange('emailNotifications', value)}
                color="primary"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">اعلان‌های پیامک</h4>
                <p className="text-sm text-text-light">ارسال اعلان از طریق پیامک</p>
              </div>
              <Switch
                isSelected={settings.smsNotifications}
                onValueChange={(value) => handleSettingChange('smsNotifications', value)}
                color="primary"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">اعلان‌های push</h4>
                <p className="text-sm text-text-light">اعلان‌های مرورگر</p>
              </div>
              <Switch
                isSelected={settings.pushNotifications}
                onValueChange={(value) => handleSettingChange('pushNotifications', value)}
                color="primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              فرکانس اعلان‌ها
            </label>
            <Select
              selectedKeys={[settings.notificationFrequency]}
              onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
              variant="bordered"
            >
              <SelectItem key="immediate">فوری</SelectItem>
              <SelectItem key="hourly">ساعتی</SelectItem>
              <SelectItem key="daily">روزانه</SelectItem>
              <SelectItem key="weekly">هفتگی</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* System Settings */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <FilterIcon className="size-6 text-success" />
            <h3 className="text-lg font-semibold text-text-dark">تنظیمات سیستم</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">پشتیبان‌گیری خودکار</h4>
                <p className="text-sm text-text-light">پشتیبان‌گیری خودکار از داده‌ها</p>
              </div>
              <Switch
                isSelected={settings.autoBackup}
                onValueChange={(value) => handleSettingChange('autoBackup', value)}
                color="success"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-background-50 rounded-lg">
              <div>
                <h4 className="font-medium text-text-dark">حالت دیباگ</h4>
                <p className="text-sm text-text-light">نمایش اطلاعات دیباگ</p>
              </div>
              <Switch
                isSelected={settings.debugMode}
                onValueChange={(value) => handleSettingChange('debugMode', value)}
                color="warning"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                فرکانس پشتیبان‌گیری
              </label>
              <Select
                selectedKeys={[settings.backupFrequency]}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                variant="bordered"
              >
                <SelectItem key="hourly">ساعتی</SelectItem>
                <SelectItem key="daily">روزانه</SelectItem>
                <SelectItem key="weekly">هفتگی</SelectItem>
                <SelectItem key="monthly">ماهانه</SelectItem>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                نگهداری لاگ (روز)
              </label>
              <Input
                type="number"
                value={settings.logRetention.toString()}
                onChange={(e) => handleSettingChange('logRetention', parseInt(e.target.value))}
                placeholder="90"
                variant="bordered"
                min={7}
                max={365}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminSettings
