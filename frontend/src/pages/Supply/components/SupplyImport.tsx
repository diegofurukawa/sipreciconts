// src/pages/Supply/components/SupplyImport.tsx
import React, { useState, useRef } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/useToast';
import { SupplyService } from '@/pages/Supply/services';
import { SUPPLY_ROUTES } from '@/pages/Supply/routes';
import { SupplyImportResponse } from '@/pages/Supply/types';

const SupplyImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<SupplyImportResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      
      // Em uma implementação real, você teria suporte a progresso na importação
      // Para esta demonstração, nós simulamos o progresso
      const intervalId = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(intervalId);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      const response = await SupplyService.import(file);
      clearInterval(intervalId);
      setUploadProgress(100);
      
      // Transforme a resposta para o formato esperado
      const importResult: SupplyImportResponse = {
        total_processed: response.total_processed || response.total || 0,
        success_count: response.success_count || response.success || 0,
        error_count: response.error_count || (response.errors ? response.errors.length : 0),
        errors: response.errors || []
      };
      
      setResult(importResult);
      
      if (importResult.error_count === 0) {
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Insumos importados com sucesso'
        });
      } else {
        showToast({
          type: 'warning',
          title: 'Importação concluída com erros',
          message: `${importResult.error_count} erros encontrados`
        });
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao importar insumos'
      });
    } finally {
      setImporting(false);
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
            onClick={() => navigate(SUPPLY_ROUTES.ROOT)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Importar Insumos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(SUPPLY_ROUTES.ROOT)} variant="outline">
            Voltar para lista
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
            <p className="font-medium">O arquivo deve conter as seguintes colunas:</p>
            <p>Nome, Tipo, Unidade de Medida (obrigatórios)</p>
            <p>Apelido, Código EAN, Descrição (opcionais)</p>
          </div>
          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="bg-emerald-600 hover:bg-emerald-700"
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
                        {Object.entries(error.data || {})
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
              onClick={() => navigate(SUPPLY_ROUTES.ROOT)}
            >
              Voltar para lista
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SupplyImport;