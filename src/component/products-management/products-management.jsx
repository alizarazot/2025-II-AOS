import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./products-service/products-service";
import { auditoriaService } from "../../services/auditoria-service";

import * as Excel from "exceljs";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

export function Products() {
  // Datos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI/Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    Name: "",
    Description: "",
    Price: "",
    Stock: "",
    State: "Activa",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      // formatear timestamps con tus nombres de campos (Creation/Update)
      const formatted = data.map((p) => {
        const created = p.Creation?.toDate ? p.Creation.toDate() : p.Creation;
        const updated = p.Update?.toDate ? p.Update.toDate() : p.Update;
        return {
          ...p,
          _createdAtStr: created ? new Date(created).toLocaleString() : "",
          _updatedAtStr: updated ? new Date(updated).toLocaleString() : "",
        };
      });
      setProducts(formatted);
    } catch (e) {
      setError(e.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      Name: "",
      Description: "",
      Price: "",
      Stock: "",
      State: "Activa",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.Name ||
      !form.Description ||
      form.Price === "" ||
      form.Stock === ""
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    const payload = {
      ...form,
      Price: Number(form.Price),
      Stock: Number(form.Stock),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        await auditoriaService.registrarActualizacion("producto", form.Name);
      } else {
        await addProduct(payload);
        await auditoriaService.registrarCreacion("producto", form.Name);
      }
      await loadProducts();
      resetForm();
    } catch (e) {
      setError(e.message || "Ocurrió un error guardando el producto");
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setForm({
      Name: p.Name ?? "",
      Description: p.Description ?? "",
      Price: p.Price ?? "",
      Stock: p.Stock ?? "",
      State: p.State ?? "Activa",
    });
    setShowForm(true);
  };

  const onDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "¿Eliminar? ",
      html: `Vas a eliminar <b>${name || "este producto"}</b>. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);
      await auditoriaService.registrarEliminacion("producto", name);
      await loadProducts();
      await Swal.fire({
        title: "Eliminado",
        text: "El producto se eliminó correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      setError(e.message || "No se pudo eliminar");
      await Swal.fire("Error", e.message || "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex flex-md-row flex-column justify-content-md-between align-items-start align-items-md-center mb-3 gap-2">
        <h2 className="mx-0 my-md-0 my-2">Gestión de Productos</h2>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-success"
            onClick={() => DownloadProductsAsExcel(products)}
            disabled={loading || products.length === 0}
          >
            📊 Descargar Excel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => DownloadProductsAsPDF(products)}
            disabled={loading || products.length === 0}
          >
            📄 Descargar PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({
                Name: "",
                Description: "",
                Price: "",
                Stock: "",
                State: "Activa",
              });
            }}
            disabled={loading}
          >
            + Agregar Producto
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h5>
            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    className="form-control"
                    name="Name"
                    value={form.Name}
                    onChange={onChange}
                    placeholder="Ej. Camiseta Azul"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Price"
                    value={form.Price}
                    onChange={onChange}
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Stock"
                    value={form.Stock}
                    onChange={onChange}
                    min={0}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Estado *</label>
                  <select
                    className="form-select"
                    name="State"
                    value={form.State}
                    onChange={onChange}
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    className="form-control"
                    name="Description"
                    value={form.Description}
                    onChange={onChange}
                    rows={3}
                    placeholder="Describe el producto"
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-end mt-3">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={loading}
                >
                  {editingId ? "Guardar Cambios" : "Crear"}
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla - Solo se muestra cuando NO está en modo edición */}
      {!showForm && (
        <div className="card">
          <div className="card-body p-0">
            {loading && products.length === 0 ? (
              <div className="p-4 text-center text-muted">Cargando...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Stock</th>
                      <th>Estado</th>
                      <th>Creado</th>
                      <th>Actualizado</th>
                      <th className="text-center" style={{ width: 160 }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td className="text-center text-muted" colSpan={6}>
                          No hay productos
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.Name}</td>
                          <td style={{ maxWidth: 320 }}>
                            <span className="text-muted">
                              {p.Description?.length > 80
                                ? `${p.Description.slice(0, 80)}…`
                                : p.Description}
                            </span>
                          </td>
                          <td className="text-end">
                            ${Number(p.Price).toLocaleString()}
                          </td>
                          <td className="text-end">
                            {Number(p.Stock).toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${p.State === "Activa" ? "text-bg-success" : "text-bg-secondary"}`}
                            >
                              {p.State || "Inactiva"}
                            </span>
                          </td>
                          <td>{p._createdAtStr || ""}</td>
                          <td>{p._updatedAtStr || ""}</td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => onEdit(p)}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => onDelete(p.id, p.Name)}
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Función para descargar productos como Excel
async function DownloadProductsAsExcel(products) {
  const workbook = new Excel.Workbook();
  workbook.creator = "Temu2";
  workbook.lastModifiedBy = "Temu2 WebApp";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Productos", {
    properties: { tabColor: { argb: "FF28A745" } },
  });

  sheet.columns = [
    { header: "Nombre", key: "Name", width: 30 },
    { header: "Descripción", key: "Description", width: 50 },
    { header: "Precio", key: "Price", width: 15 },
    { header: "Stock", key: "Stock", width: 10 },
    { header: "Estado", key: "State", width: 15 },
    { header: "Creado", key: "Created", width: 25 },
    { header: "Actualizado", key: "Updated", width: 25 },
  ];

  products.forEach((product) => {
    sheet.addRow({
      Name: product.Name || "N/A",
      Description: product.Description || "N/A",
      Price: product.Price || 0,
      Stock: product.Stock || 0,
      State: product.State || "N/A",
      Created: product._createdAtStr || "N/A",
      Updated: product._updatedAtStr || "N/A",
    });
  });

  workbook.modified = new Date();
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "productos.xlsx";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

// Función para descargar productos como PDF
async function DownloadProductsAsPDF(products) {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 10,
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#28a745",
      color: "#fff",
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      borderBottomStyle: "solid",
    },
    tableRowEven: {
      backgroundColor: "#f8f9fa",
    },
    tableCell: {
      padding: 5,
      fontSize: 8,
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderRightStyle: "solid",
    },
    tableCellHeader: {
      padding: 5,
      fontSize: 8,
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderRightStyle: "solid",
      fontWeight: "bold",
      color: "#fff",
    },
  });

  const blob = await pdf(
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>Lista de Productos</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "20%" }]}>Nombre</Text>
            <Text style={[styles.tableCellHeader, { width: "30%" }]}>Descripción</Text>
            <Text style={[styles.tableCellHeader, { width: "12%" }]}>Precio</Text>
            <Text style={[styles.tableCellHeader, { width: "10%" }]}>Stock</Text>
            <Text style={[styles.tableCellHeader, { width: "10%" }]}>Estado</Text>
            <Text style={[styles.tableCellHeader, { width: "18%" }]}>Creado</Text>
          </View>
          {products.map((product, idx) => (
            <View key={product.id} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCell, { width: "20%" }]}>{product.Name}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>
                {product.Description?.length > 50 ? product.Description.slice(0, 50) + "..." : product.Description}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>${product.Price}</Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>{product.Stock}</Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>{product.State}</Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>{product._createdAtStr}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  ).toBlob();

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "productos.pdf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
