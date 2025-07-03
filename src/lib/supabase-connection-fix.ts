import { createClient } from '@supabase/supabase-js'

// Enhanced connection testing and fixing utilities
export class SupabaseConnectionFixer {
  private supabaseUrl: string
  private supabaseAnonKey: string
  private testClient: any

  constructor() {
    this.supabaseUrl = 'https://tidnmzsivsthwwcfdzyo.supabase.co'
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZG5tenNpdnN0aHd3Y2ZkenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjE5NTgsImV4cCI6MjA2NjI5Nzk1OH0.Sr1gSZ2qtoff7gmulkT8uIzB8eL7gqKUUNVj82OqHog'
    
    this.testClient = createClient(this.supabaseUrl, this.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: true 
      }
    })
  }

  // Test basic connectivity to Supabase
  async testBasicConnectivity(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('🔍 Testing basic connectivity to Supabase...')
      
      // Try a simple health check first
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': this.supabaseAnonKey,
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('✅ Basic connectivity test passed')
      return { success: true }
    } catch (error: any) {
      console.error('❌ Basic connectivity test failed:', error)
      return { 
        success: false, 
        error: error.message,
        details: {
          url: this.supabaseUrl,
          errorType: error.name,
          message: error.message
        }
      }
    }
  }

  // Test database access
  async testDatabaseAccess(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('🔍 Testing database access...')
      
      // Try to access a simple table count
      const { data, error } = await this.testClient
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (error) {
        throw error
      }

      console.log('✅ Database access test passed')
      return { success: true, details: { count: data } }
    } catch (error: any) {
      console.error('❌ Database access test failed:', error)
      return { 
        success: false, 
        error: error.message,
        details: {
          errorCode: error.code,
          errorMessage: error.message,
          hint: error.hint
        }
      }
    }
  }

  // Test CORS configuration
  async testCORSConfiguration(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('🔍 Testing CORS configuration...')
      
      // Make a preflight request to test CORS
      const response = await fetch(`${this.supabaseUrl}/rest/v1/profiles`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'apikey, authorization, content-type'
        }
      })

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      }

      console.log('✅ CORS test completed', corsHeaders)
      return { 
        success: true, 
        details: { 
          corsHeaders,
          origin: window.location.origin,
          status: response.status
        }
      }
    } catch (error: any) {
      console.error('❌ CORS test failed:', error)
      return { 
        success: false, 
        error: error.message,
        details: {
          origin: window.location.origin,
          errorType: error.name
        }
      }
    }
  }

  // Comprehensive connection diagnosis
  async runComprehensiveDiagnosis(): Promise<{
    overall: boolean;
    tests: {
      connectivity: any;
      database: any;
      cors: any;
    };
    recommendations: string[];
  }> {
    console.log('🚀 Starting comprehensive Supabase connection diagnosis...')
    
    const tests = {
      connectivity: await this.testBasicConnectivity(),
      database: await this.testDatabaseAccess(),
      cors: await this.testCORSConfiguration()
    }

    const recommendations: string[] = []

    // Analyze results and provide recommendations
    if (!tests.connectivity.success) {
      recommendations.push('❌ Basic connectivity failed - Check if Supabase project is active and not paused')
      recommendations.push('🔧 Verify project URL and API key in Supabase Dashboard → Settings → API')
      recommendations.push('🌐 Check your internet connection and firewall settings')
    }

    if (!tests.database.success) {
      recommendations.push('❌ Database access failed - Check RLS policies and table permissions')
      recommendations.push('🔧 Ensure tables exist and are properly configured')
      recommendations.push('📋 Run the SQL migration script to fix database structure')
    }

    if (!tests.cors.success) {
      recommendations.push('❌ CORS configuration issue detected')
      recommendations.push(`🔧 Add ${window.location.origin} to CORS allowed origins in Supabase Dashboard`)
      recommendations.push('🌐 Go to Settings → API → CORS and add your domain')
    }

    const overall = tests.connectivity.success && tests.database.success

    if (overall) {
      recommendations.push('✅ All tests passed! Connection is working properly')
    } else {
      recommendations.push('⚠️ Some tests failed - follow the recommendations above')
      recommendations.push('🔄 After making changes, refresh the page and test again')
    }

    console.log('📊 Diagnosis complete:', { overall, tests, recommendations })
    
    return { overall, tests, recommendations }
  }

  // Attempt automatic fixes
  async attemptAutomaticFixes(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🔧 Attempting automatic fixes...')
      
      // Clear any cached connections
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
      
      // Test with a fresh client
      const freshClient = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        }
      })

      // Try a simple operation
      const { data, error } = await freshClient
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (error) {
        throw error
      }

      console.log('✅ Automatic fix successful')
      return { 
        success: true, 
        message: 'Connection restored successfully!',
        details: { count: data }
      }
    } catch (error: any) {
      console.error('❌ Automatic fix failed:', error)
      return { 
        success: false, 
        message: `Automatic fix failed: ${error.message}`,
        details: error
      }
    }
  }
}

// Export singleton instance
export const connectionFixer = new SupabaseConnectionFixer()

// Helper function for quick diagnosis
export const diagnoseConnection = async () => {
  return await connectionFixer.runComprehensiveDiagnosis()
}

// Helper function for quick fix attempt
export const attemptQuickFix = async () => {
  return await connectionFixer.attemptAutomaticFixes()
}