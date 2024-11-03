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
  Loader2
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
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

// Tipos
interface ImportError {
  row: number;
  message: string;
  data: Record<string, string>;
}

interface ImportResult {
  success: boolean;
  message: string;
  errors?: ImportError[];
  totalProcessed?: number;
  successCount?: number;
  errorCount?: number;
}

export const CustomerImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        showToast({
          type: 'error',
          title: 'Arquivo inválido',
          message: 'Por favor, selecione um arquivo CSV'
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
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
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setResult(null);
    } else {
      showToast({
        type: 'error',
        title: 'Arquivo inválido',
        message: 'Por favor, selecione um arquivo CSV'
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      await CustomerService.import(file);
      setResult({
        success: true,
        message: 'Importação concluída com sucesso',
        successCount: 0, // Será atualizado com a resposta real da API
        errorCount: 0,
        totalProcessed: 0
      });
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes importados com sucesso'
      });
    } catch (error: any) {
      const errorResult: ImportResult = {
        success: false,
        message: 'Erro na importação',
        errors: error.response?.data?.errors || [],
        errorCount: error.response?.data?.errors?.length || 0,
        totalProcessed: error.response?.data?.totalProcessed || 0,
        successCount: error.response?.data?.successCount || 0
      };
      setResult(errorResult);
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
      const template = `Nome,Documento,Tipo de Cliente,Celular,Email,Endereço,Complemento
João Silva,123.456.789-00,Individual,(11) 98765-4321,joao.silva@email.com,Rua das Flores 123,Apto 42
Maria Oliveira,987.654.321-00,Empresarial,(11) 97654-3210,maria.oliveira@empresa.com,Avenida Paulista 1000,Sala 505`;

      const blob = new Blob([template], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modelo_importacao_clientes.csv');
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
        <Button onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Modelo
        </Button>
      </div>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>
            Arraste e solte seu arquivo CSV ou clique para selecionar
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
              accept=".csv"
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
                  <p className="text-sm text-gray-500 mt-1">Somente arquivos CSV são aceitos</p>
                </div>
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
              {result.success ? (
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
              Total processado: {result.totalProcessed} | 
              Sucesso: {result.successCount} | 
              Erros: {result.errorCount}
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