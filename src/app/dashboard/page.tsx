'use client' // Needed for hooks like useRouter and useEffect

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/useUserStore'
import { createClient as createBrowserClient } from '@/lib/supabase/client' // Rename for clarity
// Import the server action
import { createOkrAction } from '../actions'; 
// We will call the server action, not the service directly from client
// import { createOkr, getOkrs } from '@/lib/okrService' 
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
} from 'reactflow';
// Import our custom types
import type { Okr, OkrItemType } from '@/types'; 

import 'reactflow/dist/style.css';

// Initial state can be empty, will be populated by fetch
const initialNodes: Node<Okr>[] = [];
const initialEdges: Edge[] = [];

// Helper to transform Okr data to ReactFlow nodes
const okrToNode = (okr: Okr, position?: { x: number; y: number }): Node<Okr> => ({
  id: okr.id,
  // Use random position if not provided (e.g., for initial fetch)
  position: position || { x: Math.random() * 400, y: Math.random() * 400 },
  data: okr, // Store the full Okr object in the node data
  // You might want custom node types later based on okr.okr_type
  type: 'default', // Or a custom node type like 'objectiveNode', 'krNode'
});


export default function DashboardPage() {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const supabase = createBrowserClient() // Use browser client for auth listeners
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState<Node<Okr>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching (Placeholder) --- 
  const fetchAndSetOkrs = useCallback(async () => {
    setLoading(true);
    try {
      console.warn("TODO: Implement client-side fetching via Server Action or API route");
      // Example placeholder:
      setNodes([]); 
      setEdges([]);
    } catch (error) { 
      console.error("Error fetching OKRs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAndSetOkrs();
    } else {
      setNodes([]); 
      setEdges([]);
      setLoading(true);
    }
  }, [user, fetchAndSetOkrs]);

  // --- ReactFlow Handlers --- 
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => {
      console.log('Edge connected:', connection);
      // TODO: Persist edge connection using a Server Action/API Route
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  );

  // Handle double click on pane to create a node using Server Action
  const onPaneDoubleClick = useCallback(
    async (event: React.MouseEvent) => {
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNodeType: OkrItemType = 'objective'; // Default to objective for now
      const newNodeContent = `New ${newNodeType.replace('_', ' ')}`;

      console.log(`Attempting to create ${newNodeType} via Server Action at`, position);

      try {
        setLoading(true); 
        // Call the imported server action
        const newOkr = await createOkrAction({ 
          content: newNodeContent,
          okr_type: newNodeType,
        });
        
        const reactFlowNode = okrToNode(newOkr, position);
        setNodes((nds) => nds.concat(reactFlowNode));
        console.log("Added node from Server Action result:", reactFlowNode);

      } catch (error) { 
        console.error(`Error creating ${newNodeType} via Server Action:`, error);
      } finally {
         setLoading(false);
      }
    },
    [screenToFlowPosition, setLoading, setNodes]
  );

  // --- Auth Handlers --- 
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       if (event === 'SIGNED_OUT') {
         setUser(null)
         router.push('/')
       } else if (event === 'SIGNED_IN') {
         setUser(session?.user ?? null)
       }
       // Initial check still useful
       else if (event === 'INITIAL_SESSION' && !session?.user){
         router.push('/');
       }
    });

    // Clean up subscription
    return () => {
      subscription?.unsubscribe()
    }

  }, [router, user, setUser, supabase]) // Removed user dependency here, handled by INITIAL_SESSION

  const handleLogout = async () => {
     await supabase.auth.signOut();
     // Auth listener above will handle redirect and state clearing
  }

  // --- Render --- 
  if (!user && loading) { // Show loading only if no user and initial load potentially happening
    return <p>Loading authentication...</p>;
  }
  
  // If no user after checks, Auth UI should be shown via root page logic, 
  // but render null here to avoid flashing dashboard briefly if redirect is slow.
  if (!user) { 
      return null; 
  }

  return (
    <div className="w-full h-screen flex flex-col p-4">
      {/* Header/Logout */}
      <div className="flex justify-between items-center mb-4">
         <div>
           <h1 className="text-3xl font-bold">Dashboard</h1>
           <p>Welcome, {user.email}!</p>
         </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
        >
          Logout
        </button>
      </div>
      {/* ReactFlow Canvas */}
      <div className="flex-grow bg-card rounded-lg shadow mb-6 border border-border">
        {loading && nodes.length === 0 ? ( // Show loading indicator only if truly loading initial data
           <div className="flex items-center justify-center h-full">Loading OKRs...</div> 
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDoubleClick={onPaneDoubleClick} // Keep using onDoubleClick based on prior linter feedback
            fitView
            className="bg-background"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
    </div>
  )
} 