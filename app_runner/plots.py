import numpy as np
import pandas as pd
import plotly.graph_objs as go
import plotly.express as px
from sklearn.metrics import confusion_matrix, precision_recall_curve, roc_curve, roc_auc_score, auc
from sklearn.preprocessing import label_binarize

class Evaluation:
    def __init__(self):
        pass

    def generate_evaluation_plots(self, y_test, y_pred):
        y_test = y_test.to_numpy()
        y_pred = y_pred.flatten().astype(int)

        unique_classes = np.unique(y_test)
        num_classes = len(unique_classes)

        # Binarize y_test for multi-class ROC and precision-recall calculations
        y_test_binarized = label_binarize(y_test, classes=unique_classes)

        conf_matrix = confusion_matrix(y_test, y_pred)

        class_labels = [f'Class {i}' for i in unique_classes]
        color_scale = ['#B7CEEB', '#8AAAE5', '#5D85E0', '#3E61D4']
        
        # Create a Plotly heatmap
        fig_cm = px.imshow(
            conf_matrix,
            x=class_labels,
            y=class_labels,
            labels=dict(x="Predicted", y="True"),
            zmin=0, zmax=100,  # Adjust the zmin and zmax values based on your data
            color_continuous_scale=color_scale,  # You can choose a different color scale
        )

        # Add labels to the cells
        for i in range(len(class_labels)):
            for j in range(len(class_labels)):
                fig_cm.add_annotation(
                    x=class_labels[j],
                    y=class_labels[i],
                    text=str(conf_matrix[i, j]),
                    showarrow=False
                )

        # Customize the layout
        fig_cm.update_layout(
            title="Confusion Matrix",
            xaxis_title="Predicted",
            yaxis_title="True",
            width=400,
            height=400
        )

        fig_cm_json = fig_cm.to_json()


        if num_classes > 2:
            # Precision-Recall Curve (One-vs-Rest approach for multi-class)
            fig_prc = go.Figure()
            
            for i in range(num_classes):
                precision, recall, _ = precision_recall_curve(y_test_binarized[:, i], y_pred == i)
                fig_prc.add_trace(go.Scatter(
                    x=recall, y=precision,
                    mode='lines',
                    name=f'Class {i} PRC',
                ))

            fig_prc.update_layout(
                xaxis_title='Recall',
                yaxis_title='Precision',
                title='Precision-Recall Curve',
                showlegend=True,
                width=400,
                height=400
            )

            fig_prc_json = fig_prc.to_json()

            # ROC Curve (One-vs-Rest approach for multi-class)
            fig_roc = go.Figure()

            for i in range(num_classes):
                fpr, tpr, _ = roc_curve(y_test_binarized[:, i], y_pred == i)
                roc_auc = auc(fpr, tpr)
                fig_roc.add_trace(go.Scatter(
                    x=fpr, y=tpr,
                    mode='lines',
                    name=f'Class {i} ROC (AUC = {roc_auc:.2f})'
                ))

            fig_roc.update_layout(
                xaxis_title='False Positive Rate',
                yaxis_title='True Positive Rate',
                title='Receiver Operating Characteristic (ROC) Curve',
                showlegend=True,
                width=400,
                height=400
            )

            fig_roc_json = fig_roc.to_json()

        else:
            precision, recall, thresholds = precision_recall_curve(y_test, y_pred)

            # Create a Plotly figure for the precision-recall curve with enhanced styling
            fig_prc = go.Figure()

            fig_prc.add_trace(go.Scatter(
                x=recall, y=precision,
                mode='lines',
                name='Precision-Recall Curve',
                line=dict(color='royalblue', width=2),
                marker=dict(size=8, symbol='circle', color='royalblue')
            ))

            fig_prc.update_layout(
                xaxis_title='Recall',
                yaxis_title='Precision',
                title='Precision-Recall Curve',
                showlegend=False,
                plot_bgcolor='white',
                font=dict(family='Arial', size=12, color='black'),
                title_font=dict(size=16, color='black'),
                xaxis=dict(showline=True, linecolor='black', linewidth=2, mirror=True),
                yaxis=dict(showline=True, linecolor='black', linewidth=2, mirror=True),
                legend=dict(x=0.05, y=0.95),
                width=400,
                height=400
            )

            # Highlight the point with maximum F1 score
            max_f1 = 2 * (precision * recall) / (precision + recall)
            max_f1_threshold = thresholds[max_f1.argmax()]
            fig_prc.add_shape(type='line', x0=max_f1_threshold, x1=max_f1_threshold, y0=0, y1=1, line=dict(color='red', width=2, dash='dash'))
            fig_prc.add_annotation(text=f'Max F1 ({max_f1.max():.2f})', x=max_f1_threshold, y=0.6, showarrow=False, font=dict(color='red'))

            fig_prc_json = fig_prc.to_json()

            fpr, tpr, thresholds = roc_curve(y_test, y_pred, drop_intermediate=False)

            # Calculate AUC (Area Under the Curve)
            roc_auc = roc_auc_score(y_test, y_pred)

            # Create a Plotly figure for the ROC curve
            fig_roc = go.Figure()

            fig_roc.add_trace(go.Scatter(x=fpr, y=tpr, mode='lines', name='ROC Curve (AUC = {:.2f})'.format(roc_auc)))

            fig_roc.update_layout(
                xaxis_title='False Positive Rate',
                yaxis_title='True Positive Rate',
                title='Receiver Operating Characteristic (ROC) Curve',
                showlegend=True,
                legend=dict(x=0.01, y=0.99),
                width=400,
                height=400
            )

            fig_roc_json = fig_roc.to_json()

        return {"confusion_matrix": fig_cm_json, "precision_recall_curve": fig_prc_json, "roc": fig_roc_json}


class Dataset:
    def __init__(self):
        pass

    def generate_dataset_distribution(self, x):
        self.x_train = pd.read_csv(x)
        