#!/usr/bin/env python3
"""
API Wrapper for Mina Agent
Provides a JSON API interface for the Mina shopping agent.
"""

import sys
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import MinaAgent
from mina_agent import MinaAgent, ProductCategory

def process_search(input_data):
    """
    Process a search request and return recommendations.
    
    Args:
        input_data: Dictionary with category, budget_max, priorities, specific_needs
        
    Returns:
        Dictionary with recommendations and metadata
    """
    try:
        # Initialize agent
        agent = MinaAgent()
        
        # Parse category
        category_str = input_data.get('category', '').lower()
        if category_str == 'laptop':
            category = ProductCategory.LAPTOP
        elif category_str == 'furniture':
            category = ProductCategory.FURNITURE
        elif category_str == 'appliance':
            category = ProductCategory.APPLIANCE
        else:
            return {
                'error': f'Invalid category: {category_str}',
                'valid_categories': ['laptop', 'furniture', 'appliance']
            }
        
        # Build requirements
        requirements = {
            'category': category.value,
            'budget_max': float(input_data.get('budget_max', 1000)),
            'priorities': input_data.get('priorities', []),
            'specific_needs': input_data.get('specific_needs', '')
        }
        
        # Execute research workflow (without async for simplicity)
        # Step 1: Browse retailers
        products = agent.browse_retailers(requirements)
        
        if not products:
            return {
                'success': False,
                'message': 'No products found matching your criteria',
                'recommendations': []
            }
        
        # Step 2: Analyze with Claude (or fallback)
        analyses = agent.analyze_with_claude(products, requirements)
        
        # Step 3: Calculate confidence scores
        confidence_scores = agent.calculate_confidence_scores(products, analyses)
        
        # Step 4: Generate recommendations
        recommendations = agent.generate_recommendations(
            products, analyses, confidence_scores
        )
        
        # Format output for JSON
        result = {
            'success': True,
            'category': category.value,
            'requirements': requirements,
            'recommendations': [
                {
                    'product': {
                        'name': rec.product.name,
                        'price': rec.product.price,
                        'retailer': rec.product.retailer,
                        'url': rec.product.url,
                        'specs': rec.product.specs,
                        'reviews_summary': rec.product.reviews_summary,
                        'rating': rec.product.rating
                    },
                    'confidence_score': rec.confidence_score,
                    'reasoning': rec.reasoning,
                    'pros': rec.pros,
                    'cons': rec.cons
                }
                for rec in recommendations
            ]
        }
        
        return result
        
    except Exception as e:
        return {
            'error': str(e),
            'success': False
        }

def main():
    """Main entry point for API wrapper."""
    try:
        # Read input from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                'error': 'No input provided',
                'usage': 'python api_wrapper.py \'{"category": "laptop", "budget_max": 3000, "priorities": ["Performance"]}\''
            }))
            sys.exit(1)
        
        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        
        # Process the search
        result = process_search(input_data)
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            'error': f'Invalid JSON input: {str(e)}'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'error': f'Unexpected error: {str(e)}'
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
