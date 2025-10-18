import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, budget, priorities, specificNeeds } = body;

    // Validate input
    if (!category || !budget || !priorities) {
      return NextResponse.json(
        { error: 'Missing required fields: category, budget, priorities' },
        { status: 400 }
      );
    }

    // Prepare Python script input
    const pythonScript = path.join(process.cwd(), 'backend', 'api_wrapper.py');
    const input = JSON.stringify({
      category,
      budget_max: budget,
      priorities,
      specific_needs: specificNeeds || ''
    });

    // Execute Python backend
    const { stdout, stderr } = await execPromise(
      `python3 "${pythonScript}" '${input.replace(/'/g, "\\'")}'`,
      { 
        cwd: path.join(process.cwd(), 'backend'),
        timeout: 30000 // 30 second timeout
      }
    );

    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    // Parse Python output
    const result = JSON.parse(stdout);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process search request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
