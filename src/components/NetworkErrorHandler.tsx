import React, { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Settings, ExternalLink } from 'lucide-react'
import { connectionFixer } from '../lib/supabase-connection-fix'

interface NetworkErrorHandlerProps {
  error: any
  onRetry: () => void
  onDiagnose?: () => void
}

const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({ 
  error, 
  onRetry, 
  onDiagnose 
}) => {
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const [isAttemptingFix, setIsAttemptingFix] = useState(false)

  const isNetworkError = error?.message?.includes('NetworkError') || 
                        error?.message?.includes('fetch') ||
                        error?.message?.includes('Failed to fetch')

  const runQuickDiagnosis = async () => {
    setIsRunningDiagnosis(true)
    setDiagnosisResult(null)
    
    try {
      const result = await connectionFixer.runComprehensiveDiagnosis()
      setDiagnosisResult(result)
    } catch (err) {
      console.error('Diagnosis failed:', err)
      setDiagnosisResult({
        overall: false,
        tests: {},
        recommendations: ['Failed to run diagnosis - please check manually']
      })
    } finally {
      setIsRunningDiagnosis(false)
    }
  }

  const attemptQuickFix = async () => {
    setIsAttemptingFix(true)
    
    try {
      const result = await connectionFixer.attemptAutomaticFixes()
      
      if (result.success) {
        // Wait a moment then retry the original operation
        setTimeout(() => {
          onRetry()
        }, 1000)
      }
    } catch (err) {
      console.error('Quick fix failed:', err)
    } finally {
      setIsAttemptingFix(false)
    }
  }

  if (!isNetworkError) {
    // Regular error display for non-network errors
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-2">A apărut o eroare</h3>
            <p className="text-red-700 mb-4">{error?.message || 'Eroare necunoscută'}</p>
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Problemă de Conectivitate
        </h3>
        <p className="text-gray-600">
          Nu ne putem conecta la serverul Supabase. Acest lucru poate fi cauzat de:
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Cauze posibile:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-red-500">•</span>
            <span>Proiectul Supabase este în pauză sau inactiv</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-500">•</span>
            <span>Configurare CORS incorectă</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-500">•</span>
            <span>Credențiale API incorecte</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-500">•</span>
            <span>Probleme de rețea sau firewall</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={runQuickDiagnosis}
          disabled={isRunningDiagnosis}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunningDiagnosis ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Diagnosticare...</span>
            </>
          ) : (
            <>
              <Settings className="h-5 w-5" />
              <span>Rulează Diagnosticul</span>
            </>
          )}
        </button>

        <button
          onClick={attemptQuickFix}
          disabled={isAttemptingFix}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAttemptingFix ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Se repară...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              <span>Încearcă Repararea</span>
            </>
          )}
        </button>
      </div>

      {diagnosisResult && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Rezultatul Diagnosticului:</h4>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${diagnosisResult.tests.connectivity?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Conectivitate de bază: {diagnosisResult.tests.connectivity?.success ? 'OK' : 'EȘUAT'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${diagnosisResult.tests.database?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Acces bază de date: {diagnosisResult.tests.database?.success ? 'OK' : 'EȘUAT'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${diagnosisResult.tests.cors?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Configurare CORS: {diagnosisResult.tests.cors?.success ? 'OK' : 'EȘUAT'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium text-gray-800">Recomandări:</h5>
            {diagnosisResult.recommendations.map((rec: string, index: number) => (
              <p key={index} className="text-sm text-gray-700">{rec}</p>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Soluții Manuale:</h4>
        <div className="space-y-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Verifică Supabase Dashboard</span>
          </a>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Pași de verificare:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Verifică dacă proiectul <code className="bg-gray-200 px-1 rounded">tidnmzsivsthwwcfdzyo</code> este activ</li>
              <li>Mergi la Settings → API și verifică credențialele</li>
              <li>Mergi la Settings → API → CORS și adaugă <code className="bg-gray-200 px-1 rounded">{window.location.origin}</code></li>
              <li>Salvează modificările și așteaptă câteva minute</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Încearcă Din Nou</span>
        </button>
      </div>
    </div>
  )
}

export default NetworkErrorHandler