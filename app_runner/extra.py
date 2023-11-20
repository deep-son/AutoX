
# Function to add nodes and edges to the graph
                        def add_nodes(graph, node_data, parent=None):
                            for key, value in node_data['children'].items():
                                graph.add_node(key, num_leaves=value['num_leaves'], hp_name=value['hp_name'])
                                if parent is not None:
                                    graph.add_edge(parent, key)
                                add_nodes(graph, value, key)

                        # Create a directed graph
                        G = nx.DiGraph()

                        # Add nodes and edges to the graph
                        add_nodes(G, trie_data)

                        # Define a custom layout with a top-down orientation
                        pos = nx.nx_agraph.graphviz_layout(G, prog="dot", args="-Grankdir=TB")

                        # Create a Plotly figure for the Trie visualization
                        edge_x = []
                        edge_y = []
                        labels = {}
                        for edge in G.edges():
                            x0, y0 = pos[edge[0]]
                            x1, y1 = pos[edge[1]]
                            edge_x.extend([x0, x1, None])
                            edge_y.extend([y0, y1, None])
                        for node in G.nodes(data=True):
                            x, y = pos[node[0]]
                            labels[node[0]] = f"{node[0]}<br>Leaves: {node[1]['num_leaves']}<br>hp_name: {node[1]['hp_name']}"

                        edge_trace = go.Scatter(
                            x=edge_x, y=edge_y,
                            line=dict(width=0.5, color='#888'),
                            hoverinfo='none',
                            mode='lines')

                        node_x = []
                        node_y = []
                        node_colors = []  # Store node colors
                        hp_names = data.get("hp_names", [])
                        for node in pos:
                            x, y = pos[node]
                            node_x.append(x)
                            node_y.append(y)
                            # Check if hp_name is similar to any hp_name in hp_names
                            if node in data["hp_names"][0]:
                                node_colors.append("red")  # Color the node red
                            else:
                                node_colors.append("lightblue")  # Default color

                        node_trace = go.Scatter(
                            x=node_x, y=node_y,
                            mode='markers+text',
                            text=list(labels.values()),
                            textposition="bottom center",  # Shift labels below the nodes
                            marker=dict(
                                showscale=False,
                                size=20,
                                colorbar=dict(
                                    thickness=15,
                                    title='Node Connections',
                                    xanchor='left',
                                    titleside='right'
                                ),
                                color=node_colors  # Set node colors
                            ))

                        fig = go.Figure(data=[edge_trace, node_trace],
                                        layout=go.Layout(
                                            showlegend=False,
                                            hovermode='closest',
                                            margin=dict(b=0, l=0, r=0, t=0),
                                            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                            height=500,
                                            width=500))
                        
                        fig.write_image("plotly_figure.png")