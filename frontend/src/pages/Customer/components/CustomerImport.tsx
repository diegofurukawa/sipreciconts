// src/pages/Customer/components/CustomerImport.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Download,
  X,
  CheckCircle2,
  Loader2,
  Settings2
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/useToast';
import { customerService, type CustomerImportResponse } from '@/services/api/modules/customer';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

export const CustomerImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<CustomerImportResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importOptions, setImportOptions] = useState({
    update_existing: false,
    skip_errors: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
        showToast({
          type: 'error',
          title: 'Arquivo inválido',
          message: 'Por favor, selecione um arquivo CSV ou XLSX'
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      setResult(null);
      setUploadProgress(0);
    } else {
      showToast({
        type: 'error',
        title: 'Arquivo inválido',
        message: 'Por favor, selecione um arquivo CSV ou XLSX'
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      setUploadProgress(0);
      
      const result = await customerService.import(
        file,
        importOptions,
        (progress) => setUploadProgress(progress)
      );

      setResult(result);
      
      if (result.error_count === 0) {
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Clientes importados com sucesso'
        });
      } else {
        showToast({
          type: 'warning',
          title: 'Importação concluída com erros',
          message: `${result.error_count} erros encontrados`
        });
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao importar clientes'
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const format = 'csv'; // ou 'xlsx'
      const blob = await customerService.downloadTemplate(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `modelo_importacao_clientes.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao baixar modelo'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.ROOT)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Importar Clientes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Opções de Importação</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizar existentes</Label>
                    <p className="text-sm text-muted-foreground">
                      Atualiza clientes que já existem no sistema
                    </p>
                  </div>
                  <Switch
                    checked={importOptions.update_existing}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, update_existing: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ignorar erros</Label>
                    <p className="text-sm text-muted-foreground">
                      Continua a importação mesmo quando encontrar erros
                    </p>
                  </div>
                  <Switch
                    checked={importOptions.skip_errors}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, skip_errors: checked }))
                    }
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Modelo
          </Button>
        </div>
      </div>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>
            Arraste e solte seu arquivo CSV/XLSX ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center justify-center space-x-4">
                <FileText className="h-8 w-8 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResult(null);
                    setUploadProgress(0);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="font-medium">Clique para selecionar ou arraste seu arquivo</p>
                  <p className="text-sm text-gray-500 mt-1">Arquivos CSV e XLSX são aceitos</p>
                </div>
              </div>
            )}

            {importing && uploadProgress > 0 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">
                  Upload em progresso: {uploadProgress.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-gray-500">
            <p className="font-medium">Campos obrigatórios:</p>
            <p>Nome, Celular</p>
          </div>
          <Button
            onClick={handleImport}
            disabled={!file || importing}
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Resultado da Importação */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {result.error_count === 0 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Importação Concluída</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Erros na Importação</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              Total processado: {result.total_processed} | 
              Sucesso: {result.success_count} | 
              Erros: {result.error_count}
            </CardDescription>
          </CardHeader>
          
          {result.errors && result.errors.length > 0 && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Linha</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead>Dados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.errors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.row}</TableCell>
                      <TableCell className="text-red-600">{error.message}</TableCell>
                      <TableCell>
                        {Object.entries(error.data)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}

          <CardFooter className="border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.ROOT)}
            >
              Voltar para lista
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CustomerImport;