'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Toast } from '@/app/components/ui/Toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Upload as CloudUpload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/Alert';
import { LoadingIndicator } from '@/app/components/ui/LoadingIndicator';
import { useSleep } from '@/app/hooks/useSleep';

export default function SleepDataMigration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordsCount, setRecordsCount] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);
  const [duplicateRecordsCount, setDuplicateRecordsCount] = useState(0);
  const [duplicateRemindersCount, setDuplicateRemindersCount] = useState(0);
  
  // Estado para o toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  const { migrateFromLocalStorage } = useSleep();

  const displayToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleMigration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await migrateFromLocalStorage();
      
      if (!result.success) {
        throw new Error(result.error || "Erro desconhecido durante a migração");
      }
      
      setRecordsCount(result.recordsCount);
      setRemindersCount(result.remindersCount);
      setDuplicateRecordsCount(result.duplicateRecordsCount);
      setDuplicateRemindersCount(result.duplicateRemindersCount);
      
      // Apenas limpa dados locais se houver migração bem-sucedida ou duplicados
      if (result.recordsCount > 0 || result.remindersCount > 0 || 
          result.duplicateRecordsCount > 0 || result.duplicateRemindersCount > 0) {
        localStorage.removeItem('sleepRecords');
        localStorage.removeItem('sleepReminders');
      }
      
      setSuccess(true);
      displayToast(
        `${result.recordsCount} registros e ${result.remindersCount} lembretes foram migrados.${
          (result.duplicateRecordsCount > 0 || result.duplicateRemindersCount > 0) 
            ? ` ${result.duplicateRecordsCount} registros e ${result.duplicateRemindersCount} lembretes foram ignorados por já existirem.` 
            : ''
        }`,
        'success'
      );
    } catch (e) {
      setError(`Erro durante a migração: ${e instanceof Error ? e.message : 'Desconhecido'}`);
      displayToast(
        `Não foi possível migrar seus dados. Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Migração de Sono</CardTitle>
          <CardDescription>
            Migre seus registros e lembretes de sono para a nuvem para acessá-los em qualquer dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Dados migrados com sucesso!</AlertTitle>
              <AlertDescription>
                {recordsCount} registros e {remindersCount} lembretes foram migrados.
                {(duplicateRecordsCount > 0 || duplicateRemindersCount > 0) && (
                  <p className="mt-1">
                    {duplicateRecordsCount} registros e {duplicateRemindersCount} lembretes foram ignorados por já existirem.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <p>
                Esta operação transferirá seus registros e lembretes de sono armazenados localmente 
                para o banco de dados na nuvem. Seus dados continuarão protegidos e privados.
              </p>
              <p>
                Os dados migrados estarão disponíveis em todos os seus dispositivos após fazer login.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!success && (
            <Button 
              onClick={handleMigration} 
              disabled={loading}
              className="flex gap-2"
            >
              {loading ? (
                <>
                  <LoadingIndicator /> Migrando...
                </>
              ) : (
                <>
                  <CloudUpload size={16} /> Migrar Dados
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Renderiza o toast quando necessário */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
} 