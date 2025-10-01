import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProducts, addProduct, updateProduct, deleteProduct } from "./products-service/products-service";

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
    setForm({ Name: "", Description: "", Price: "", Stock: "", State: "Activa" });
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.Name || !form.Description || form.Price === "" || form.Stock === "") {
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
      } else {
        await addProduct(payload);
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
      title: '¿Eliminar? ',
      html: `Vas a eliminar <b>${name || 'este producto'}</b>. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);
      await loadProducts();
      await Swal.fire({
        title: 'Eliminado',
        text: 'El producto se eliminó correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      setError(e.message || 'No se pudo eliminar');
      await Swal.fire('Error', e.message || 'No se pudo eliminar', 'error');
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Gestión de Productos</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ Name: "", Description: "", Price: "", Stock: "", State: "Activa" });
          }}
          disabled={loading}
        >
          + Agregar Producto
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-3">{editingId ? "Editar Producto" : "Nuevo Producto"}</h5>
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
                <button className="btn btn-success" type="submit" disabled={loading}>
                  {editingId ? "Guardar Cambios" : "Crear"}
                </button>
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
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
                    <th className="text-center" style={{ width: 160 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td className="text-center text-muted" colSpan={6}>No hay productos</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.Name}</td>
                        <td style={{ maxWidth: 320 }}>
                          <span className="text-muted">
                            {p.Description?.length > 80 ? `${p.Description.slice(0, 80)}…` : p.Description}
                          </span>
                        </td>
                        <td className="text-end">${Number(p.Price).toLocaleString()}</td>
                        <td className="text-end">{Number(p.Stock).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${p.State === "Activa" ? "text-bg-success" : "text-bg-secondary"}`}>
                            {p.State || "Inactiva"}
                          </span>
                        </td>
                        <td>{p._createdAtStr || ""}</td>
                        <td>{p._updatedAtStr || ""}</td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-warning" onClick={() => onEdit(p)}>
                              ✏️ Editar
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(p.id, p.Name)}>
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
