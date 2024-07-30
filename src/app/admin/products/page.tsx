import { Button } from "@/components/ui/button"
import { PageHeader } from "../_components/PageHeader"
import { Link } from "lucide-react"

export default function AdminProductsPage() {
    return (
        <>
        <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button>
            <Link href="/admin/produts/new">Add Product</Link>
        </Button>
        </div>
          
        </>
    )
    
}