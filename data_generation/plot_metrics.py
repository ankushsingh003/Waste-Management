import pandas as pd
import matplotlib.pyplot as plt
import os

def plot_metrics(csv_path, output_dir):
    # Load the results
    df = pd.read_csv(csv_path)
    
    # Clean column names (strip whitespace)
    df.columns = [c.strip() for c in df.columns]
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Metrics to plot
    metrics = [
        'train/box_loss', 'train/cls_loss', 'train/dfl_loss',
        'metrics/precision(B)', 'metrics/recall(B)', 'metrics/mAP50(B)', 'metrics/mAP50-95(B)',
        'val/box_loss', 'val/cls_loss', 'val/dfl_loss'
    ]
    
    # Styling
    plt.style.use('dark_background')
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['axes.facecolor'] = '#1e1e1e'
    plt.rcParams['figure.facecolor'] = '#121212'
    plt.rcParams['grid.color'] = '#444444'
    
    for metric in metrics:
        if metric in df.columns:
            plt.figure(figsize=(10, 6))
            plt.plot(df['epoch'], df[metric], marker='o', color='#00cfba', linewidth=2, markersize=6, label=metric)
            
            # Formatting
            title = metric.replace('/', ' ').replace('(', '').replace(')', '').title()
            plt.title(f'{title} over Epochs', fontsize=16, color='white', pad=20)
            plt.xlabel('Epoch', fontsize=12, color='#aaaaaa')
            plt.ylabel('Value', fontsize=12, color='#aaaaaa')
            plt.grid(True, linestyle='--', alpha=0.6)
            plt.xticks(df['epoch'])
            
            # Save
            filename = metric.replace('/', '_').replace('(', '').replace(')', '') + '.png'
            save_path = os.path.join(output_dir, filename)
            plt.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='#121212')
            print(f"Saved: {save_path}")
            plt.close()
        else:
            print(f"Metric {metric} not found in CSV.")

if __name__ == "__main__":
    csv_file = r'd:\PTRN\training_runs\margin_guard_vqi_v13\results.csv'
    output_folder = r'd:\PTRN\training_runs\margin_guard_vqi_v13\plots'
    plot_metrics(csv_file, output_folder)
