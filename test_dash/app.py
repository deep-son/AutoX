from flask import Flask, render_template, request
import pandas as pd
import plotly.graph_objects as go

app = Flask(__name__)

# Define a route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Define a route to handle data loading and chart rendering
@app.route('/load_data', methods=['POST'])
def load_data():
    # Load your data into a DataFrame (you can use pandas)
    # Replace 'data.csv' with the actual path to your data
    df = pd.read_csv("https://raw.githubusercontent.com/plotly/datasets/master/volcano.csv")

    # create figure
    fig = go.Figure()

    # Add surface trace
    fig.add_trace(go.Surface(z=df.values.tolist(), colorscale="Viridis"))

    # Update plot sizing
    fig.update_layout(
        width=800,
        height=900,
        autosize=False,
        margin=dict(t=0, b=0, l=0, r=0),
        template="plotly_white",
    )

    # Update 3D scene options
    fig.update_scenes(
        aspectratio=dict(x=1, y=1, z=0.7),
        aspectmode="manual"
    )

    # Add dropdown
    fig.update_layout(
        updatemenus=[
            dict(
                type = "buttons",
                direction = "left",
                buttons=list([
                    dict(
                        args=["type", "surface"],
                        label="3D Surface",
                        method="restyle"
                    ),
                    dict(
                        args=["type", "heatmap"],
                        label="Heatmap",
                        method="restyle"
                    )
                ]),
                pad={"r": 10, "t": 10},
                showactive=True,
                x=0.11,
                xanchor="left",
                y=1.1,
                yanchor="top"
            ),
        ]
    )

    # Add annotation
    fig.update_layout(
        annotations=[
            dict(text="Trace type:", showarrow=False,
                                x=0, y=1.08, yref="paper", align="left")
        ]
    )

    # Convert the Plotly figure to JSON
    chart_json = fig.to_json()

    return chart_json

if __name__ == '__main__':
    app.run(debug=True)
