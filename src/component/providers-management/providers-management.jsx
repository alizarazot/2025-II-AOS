import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProviders, addProvider, updateProvider, deleteProvider } from "./providers-service/providers-service";

export function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true); // igual que productos: comienza en true
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const categories = [
    "Electrónicos y Gadgets",
    "Moda y Accesorios",
    "Hogar y Jardín",
    "Belleza y Cuidado Personal",
    "Deportes y Aire Libre"
  ];

  const emptyForm = {
    Name: "",
    CompanyName: "",
    Email: "",
    Phone: "",
    Address: "",
    Category: categories[0],
    Rating: 5,
    State: "Activo",
    Description: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadProviders(); }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProviders();
      const formatted = data.map(p => {
        const created = p.Creation?.toDate ? p.Creation.toDate() : p.Creation;
        const updated = p.Update?.toDate ? p.Update.toDate() : p.Update;
        return {
          ...p,
          _createdAtStr: created ? new Date(created).toLocaleString() : "",
          _updatedAtStr: updated ? new Date(updated).toLocaleString() : ""
        };
      });
      setProviders(formatted);
    } catch (e) {
      setError(e.message || "Error cargando proveedores");
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.Name.trim() || !form.CompanyName.trim() || !form.Email.trim()) {
      Swal.fire("Error", "Nombre, Empresa y Email son obligatorios", "error");
      return;
    }
    try {
      setLoading(true);
      if (editingId) {
        await updateProvider(editingId, form);
        Swal.fire({ icon: "success", title: "Actualizado", timer: 1600, showConfirmButton: false });
      } else {
        await addProvider(form);
        Swal.fire({ icon: "success", title: "Creado", timer: 1600, showConfirmButton: false });
      }
      resetForm();
      loadProviders();
    } catch (e) {
      Swal.fire("Error", e.message || "No se pudo guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = prov => {
    setForm({
      Name: prov.Name || "",
      CompanyName: prov.CompanyName || "",
      Email: prov.Email || "",
      Phone: prov.Phone || "",
      Address: prov.Address || "",
      Category: prov.Category || categories[0],
      Rating: prov.Rating || 5,
      State: prov.State || "Activo",
      Description: prov.Description || "",
    });
    setEditingId(prov.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: "¿Eliminar?",
      text: `Se borrará el proveedor "${name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!res.isConfirmed) return;
    try {
      setLoading(true);
      await deleteProvider(id);
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1400, showConfirmButton: false });
      loadProviders();
    } catch (e) {
      Swal.fire("Error", e.message || "No se pudo eliminar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Gestión de Proveedores</h2>
        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            disabled={loading}
          >
            + Agregar Proveedor
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-3">{editingId ? "Editar Proveedor" : "Nuevo Proveedor"}</h5>
            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="Name" value={form.Name} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Empresa *</label>
                  <input className="form-control" name="CompanyName" value={form.CompanyName} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-control" name="Email" value={form.Email} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" name="Phone" value={form.Phone} onChange={onChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" name="Category" value={form.Category} onChange={onChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Calificación</label>
                  <select className="form-select" name="Rating" value={form.Rating} onChange={onChange}>
                    {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} {"★".repeat(r)}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select className="form-select" name="State" value={form.State} onChange={onChange}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Dirección</label>
                  <input className="form-control" name="Address" value={form.Address} onChange={onChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="Description" value={form.Description} onChange={onChange} rows={3} />
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-end mt-3">
                <button className="btn btn-success" type="submit" disabled={loading}>{editingId ? "Guardar" : "Crear"}</button>
                <button className="btn btn-secondary" type="button" onClick={resetForm} disabled={loading}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="card">
          <div className="card-body p-0">
            {loading && providers.length === 0 ? (
              <div className="p-4 text-center text-muted">Cargando...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Empresa</th>
                      <th>Email</th>
                      <th>Categoría</th>
                      <th>Calificación</th>
                      <th>Estado</th>
                      <th>Creado</th>
                      <th>Actualizado</th>
                      <th className="text-center" style={{ width: 170 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.length === 0 ? (
                      <tr>
                        <td className="text-center text-muted p-4" colSpan={9}>No hay proveedores</td>
                      </tr>
                    ) : (
                      providers.map(p => (
                        <tr key={p.id}>
                          <td>{p.Name}</td>
                          <td>{p.CompanyName}</td>
                          <td><span className="text-muted">{p.Email}</span></td>
                          <td>{p.Category}</td>
                          <td>
                            <span className="text-warning" style={{whiteSpace:'nowrap'}}>
                              {"★".repeat(p.Rating || 0)}{"☆".repeat(5 - (p.Rating || 0))}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${p.State === "Activo" ? "text-bg-success" : "text-bg-secondary"}`}>{p.State}</span>
                          </td>
                          <td>{p._createdAtStr}</td>
                          <td>{p._updatedAtStr || ''}</td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-warning" onClick={() => startEdit(p)} disabled={loading}>✏️ Editar</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id, p.Name)} disabled={loading}>🗑️ Eliminar</button>
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