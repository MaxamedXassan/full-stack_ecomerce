import { Button } from "@/components/ui/button"
import { PageHeader } from "../_components/PageHeader"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import db from "@/db/db"
import { formatCurency, formatNumber } from "@/lib/formatters"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductAction"


export default function AdminProductsPage() {
    return (
        <>
        <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
        </Button>
        </div>
          <ProductTable />
        </>
    )
    
} 


 async function ProductTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count: {select: {orders: true}},
        },
        orderBy: {name: "asc"}
    })

    if (products.length === 0) return<p>No products found</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Availible For Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
       <TableBody>
        {products.map(product => (
            <TableRow key={product.id}>
                <TableCell>
                        {product.isAvailableForPurchase ? (
                         <>
                         <span className="sr-only">Available</span>
                        <CheckCircle2 /> 
                        </> ) : ( 
                            <>
                            <XCircle />
                            <span className="sr-only">Unavailable</span>
                            </> )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurency(product.priceInCents / 100)}</TableCell>
                <TableCell>{formatNumber(product._count.orders / 100)}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <a download href={`/admin/products/${product.id}/download`}>
                            Download
                            </a>
                           
                        </DropdownMenuItem>
                            <br/>
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/products/${product.id}/edit`}>
                           Edit
                           </Link>
                        </DropdownMenuItem>
                        <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                        <DropdownMenuSeparator />
                       
                        <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        ))}
       </TableBody>
    </Table>
}